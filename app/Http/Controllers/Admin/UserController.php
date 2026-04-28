<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function show($id)
    {
        $user = User::with(['orders' => function($q) {
            $q->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $data = $request->validated();
        
        if (!isset($data['is_active'])) {
             $data['is_active'] = true;
        }

        $user = User::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo người dùng thành công',
            'data' => $user
        ], 201);
    }

    public function update(UserUpdateRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validated();

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật người dùng thành công',
            'data' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = false;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Xóa người dùng thành công'
        ]);
    }
}
