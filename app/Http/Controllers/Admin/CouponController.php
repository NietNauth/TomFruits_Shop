<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CouponStoreRequest;
use App\Http\Requests\Admin\CouponUpdateRequest;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $coupons = Coupon::orderBy('id', 'desc')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $coupons
        ]);
    }

    public function show($id)
    {
        $coupon = Coupon::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $coupon
        ]);
    }

    public function store(CouponStoreRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = auth('admin')->id();

        if (!isset($data['is_active'])) {
             $data['is_active'] = true;
        }

        $coupon = Coupon::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo mã giảm giá thành công',
            'data' => $coupon
        ], 201);
    }

    public function update(CouponUpdateRequest $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật mã giảm giá thành công',
            'data' => $coupon
        ]);
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa mã giảm giá thành công'
        ]);
    }
}
