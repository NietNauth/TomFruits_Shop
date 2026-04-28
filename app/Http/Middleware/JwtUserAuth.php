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

class JwtUserAuth
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
            // Lấy user bằng api guard thông qua authenticate thay vì checkOrFail rồi get user
            $user = auth('api')->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }
            
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản người dùng đã bị khóa'
                ], 403);
            }

        } catch (TokenExpiredException $e) {
            return response()->json(['success' => false, 'message' => 'Phiên đăng nhập đã hết hạn'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['success' => false, 'message' => 'Phiên đăng nhập không hợp lệ'], 401);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'message' => 'Thiếu phiên đăng nhập'], 401);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy phiên đăng nhập'], 401);
        }

        return $next($request);
    }
}
