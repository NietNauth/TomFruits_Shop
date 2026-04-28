<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ReviewStoreRequest;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(ReviewStoreRequest $request)
    {
        $userId = auth('api')->id();

        // Check if user actually bought the product in the specified order
        $order = Order::with('items')
            ->where('id', $request->order_id)
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng không hợp lệ hoặc chưa hoàn thành.'
            ], 400);
        }

        $hasProduct = $order->items->contains('product_id', $request->product_id);

        if (!$hasProduct) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không thuộc đơn hàng này.'
            ], 400);
        }

        // Check if already reviewed
        $existing = Review::where('order_id', $request->order_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi.'
            ], 400);
        }

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id' => $userId,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false, // Require admin approval
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đánh giá đã được gửi và đang chờ duyệt.',
            'data' => $review
        ], 201);
    }
}
