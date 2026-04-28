<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserAddressController extends Controller
{
    public function index()
    {
        $addresses = UserAddress::where('user_id', auth('api')->id())
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_name' => 'required|string',
            'receiver_phone' => 'required|string',
            'province' => 'required|string',
            'district' => 'required|string',
            'ward' => 'required|string',
            'address_detail' => 'required|string',
            'is_default' => 'boolean'
        ]);

        $userId = auth('api')->id();

        return DB::transaction(function () use ($request, $userId) {
            if ($request->is_default) {
                UserAddress::where('user_id', $userId)->update(['is_default' => false]);
            }

            // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
            $count = UserAddress::where('user_id', $userId)->count();
            $isDefault = $count === 0 ? true : $request->is_default;

            $address = UserAddress::create([
                'user_id' => $userId,
                'receiver_name' => $request->receiver_name,
                'receiver_phone' => $request->receiver_phone,
                'province' => $request->province,
                'district' => $request->district,
                'ward' => $request->ward,
                'address_detail' => $request->address_detail,
                'is_default' => $isDefault,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thêm địa chỉ thành công',
                'data' => $address
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $address = UserAddress::where('user_id', auth('api')->id())->findOrFail($id);

        $request->validate([
            'receiver_name' => 'string',
            'receiver_phone' => 'string',
            'province' => 'string',
            'district' => 'string',
            'ward' => 'string',
            'address_detail' => 'string',
            'is_default' => 'boolean'
        ]);

        return DB::transaction(function () use ($request, $address) {
            if ($request->is_default && !$address->is_default) {
                UserAddress::where('user_id', $address->user_id)->update(['is_default' => false]);
            }

            $address->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật địa chỉ thành công',
                'data' => $address
            ]);
        });
    }

    public function destroy($id)
    {
        $address = UserAddress::where('user_id', auth('api')->id())->findOrFail($id);

        if ($address->is_default) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa địa chỉ mặc định'
            ], 400);
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa địa chỉ thành công'
        ]);
    }

    public function setDefault($id)
    {
        $userId = auth('api')->id();
        $address = UserAddress::where('user_id', $userId)->findOrFail($id);

        DB::transaction(function () use ($userId, $address) {
            UserAddress::where('user_id', $userId)->update(['is_default' => false]);
            $address->update(['is_default' => true]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Đã đặt làm địa chỉ mặc định'
        ]);
    }
}
