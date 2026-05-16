<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function createOrderFromCart($userId, $couponCode, $paymentMethod, $receiverName, $receiverPhone, $shippingAddress, $note)
    {
        return DB::transaction(function () use ($userId, $couponCode, $paymentMethod, $receiverName, $receiverPhone, $shippingAddress, $note) {
            $cartItems = Cart::with('product')->where('user_id', $userId)->get();
            $ids = $cartItems->pluck('id')->toArray();
            file_put_contents('order_debug.log', "Cart IDs: " . implode(',', $ids) . "\n", FILE_APPEND);

            if ($cartItems->isEmpty()) {
                throw new Exception('Cart is empty.');
            }

            $totalPrice = 0;
            foreach ($cartItems as $item) {
                if (!$item->product) {
                    throw new Exception("Sản phẩm không còn tồn tại.");
                }
                if ($item->product->quantity < $item->quantity) {
                    throw new Exception("Sản phẩm {$item->product->name} không đủ tồn kho (Chỉ còn: {$item->product->quantity}). Vui lòng cập nhật lại giỏ hàng.");
                }
                $itemPrice = $item->product->price;
                $itemQty = $item->quantity;
                $subtotal = $itemPrice * $itemQty;
                $totalPrice += $subtotal;
                file_put_contents('order_debug.log', "Item: {$item->product->name}, Price: {$itemPrice}, Qty: {$itemQty}, Subtotal: {$subtotal}, Running Total: {$totalPrice}\n", FILE_APPEND);
            }

            $discountAmount = 0;
            $couponId = null;

            if ($couponCode) {
                $coupon = Coupon::where('code', $couponCode)->first();
                if (!$coupon) {
                    throw new Exception('Mã giảm giá không hợp lệ.');
                }
                $discountAmount = $this->couponService->calculateDiscount($coupon, $totalPrice);
                $couponId = $coupon->id;
                $coupon->increment('used_count');
            }

            $finalPriceBeforeShipping = max(0, $totalPrice - $discountAmount);
            $shippingFee = $totalPrice >= 500000 ? 0 : 30000;
            $finalPrice = $finalPriceBeforeShipping + $shippingFee;

            $order = Order::create([
                'user_id' => $userId,
                'coupon_id' => $couponId,
                'total_price' => $totalPrice,
                'discount_amount' => $discountAmount,
                'shipping_fee' => $shippingFee,
                'final_price' => $finalPrice,
                'status' => 'pending',
                'payment_method' => $paymentMethod,
                'payment_status' => 'unpaid',
                'receiver_name' => $receiverName,
                'receiver_phone' => $receiverPhone,
                'shipping_address' => $shippingAddress,
                'note' => $note,
            ]);

            foreach ($cartItems as $item) {
                $oi = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'product_name' => $item->product->name,
                    'product_img' => $item->product->img,
                ]);
                file_put_contents('order_debug.log', "Created OrderItem ID: {$oi->id} for Order ID: {$order->id}, Product: {$oi->product_name}\n", FILE_APPEND);

                $product = $item->product;
                $product->quantity -= $item->quantity;
                if ($product->quantity <= 0) {
                    $product->status = 'out_of_stock';
                }
                $product->save();
            }

            Cart::where('user_id', $userId)->delete();

            return $order->load('items');
        });
    }

    public function cancelOrder($order)
    {
        return DB::transaction(function () use ($order) {
            $order->update(['status' => 'cancelled']);

            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->quantity += $item->quantity;
                    if ($product->quantity > 0 && $product->status === 'out_of_stock') {
                        $product->status = 'in_stock';
                    }
                    $product->save();
                }
            }

            if ($order->coupon_id) {
                $coupon = Coupon::find($order->coupon_id);
                if ($coupon) {
                    $coupon->decrement('used_count', 1);
                }
            }

            return $order;
        });
    }
}
