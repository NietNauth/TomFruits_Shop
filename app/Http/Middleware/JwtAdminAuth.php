<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtAdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Lấy user bằng guard admin thay vì checkOrFail rồi get user lần nữa
            $employee = auth('admin')->authenticate();

            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nhân viên'
                ], 404);
            }

            if (!$employee->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản nhân viên đã bị khóa'
                ], 403);
            }
            
            \Log::info('JWTAdminAuth success for: ' . $employee->email);
            
        } catch (TokenExpiredException $e) {
            \Log::error('JWTAdminAuth TokenExpiredException');
            return response()->json(['success' => false, 'message' => 'Phiên đăng nhập đã hết hạn'], 401);
        } catch (TokenInvalidException $e) {
            \Log::error('JWTAdminAuth TokenInvalidException: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Phiên đăng nhập không hợp lệ'], 401);
        } catch (JWTException $e) {
            \Log::error('JWTAdminAuth JWTException: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Thiếu phiên đăng nhập'], 401);
        } catch (Exception $e) {
            \Log::error('JWTAdminAuth Exception: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Không tìm thấy phiên đăng nhập'], 401);
        }

        return $next($request);
    }
}
