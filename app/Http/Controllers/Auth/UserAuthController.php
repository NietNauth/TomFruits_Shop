<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UserLoginRequest;
use App\Http\Requests\Auth\UserRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserAuthController extends Controller
{
    public function register(UserRegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'avatar' => $request->avatar,
            'is_active' => true,
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký tài khoản thành công',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => $user
            ]
        ], 201);
    }

    public function login(UserLoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Đăng nhập không thành công'
            ], 401);
        }

        $user = auth('api')->user();

        if (!$user->is_active) {
            auth('api')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản đã bị khóa'
            ], 403);
        }

        return $this->respondWithToken($token);
    }

    public function me()
    {
        return response()->json([
            'success' => true,
            'data' => auth('api')->user(),
        ]);
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();
        
        $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:15|unique:users,phone,' . $user->id,
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
        ]);

        $user->update($request->only('name', 'phone', 'dob', 'gender'));

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công',
            'data' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = auth('api')->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu hiện tại không chính xác'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => auth('api')->user()
            ]
        ]);
    }
}
