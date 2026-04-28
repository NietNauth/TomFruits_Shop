<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminAuthController extends Controller
{
    public function login(AdminLoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('admin')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Đăng nhập không thành công'
            ], 401);
        }

        $employee = auth('admin')->user();
        
        if (!$employee->is_active) {
            auth('admin')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản đã bị khóa'
            ], 403);
        }

        return $this->respondWithToken($token);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => auth('admin')->user(),
        ]);
    }

    public function logout()
    {
        auth('admin')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
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
                'user' => auth('admin')->user()
            ]
        ]);
    }
}
