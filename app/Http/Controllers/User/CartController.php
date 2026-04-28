<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CartStoreRequest;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $userId = auth('api')->id();
        $cartItems = Cart::with('product')->where('user_id', $userId)->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems
        ]);
    }

    public function store(CartStoreRequest $request)
    {
        $userId = auth('api')->id();
        $productId = $request->product_id;
        $quantity = $request->quantity;

        $cart = Cart::where('user_id', $userId)->where('product_id', $productId)->first();

        if ($cart) {
            $cart->quantity += $quantity;
            $cart->save();
        } else {
            $cart = Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Thêm vào giỏ hàng thành công',
            'data' => $cart->load('product')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = auth('api')->id();
        $cart = Cart::where('user_id', $userId)->findOrFail($id);

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật giỏ hàng thành công',
            'data' => $cart->load('product')
        ]);
    }

    public function destroy($id)
    {
        $userId = auth('api')->id();
        $cart = Cart::where('user_id', $userId)->findOrFail($id);
        $cart->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa sản phẩm khỏi giỏ hàng'
        ]);
    }

    public function clear()
    {
        $userId = auth('api')->id();
        Cart::where('user_id', $userId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã dọn dẹp giỏ hàng'
        ]);
    }
}
