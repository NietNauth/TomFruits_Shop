<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::with(['user', 'product'])
            ->orderBy('id', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function approve(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->is_approved = $request->input('is_approved', true);
        $review->save();

        return response()->json([
            'success' => true,
            'message' => 'Duyệt đánh giá thành công',
            'data' => $review
        ]);
    }
}
