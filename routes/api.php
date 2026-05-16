<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController as PublicCategoryController;

use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\OrderController as UserOrderController;
use App\Http\Controllers\User\ReviewController as UserReviewController;
use App\Http\Controllers\User\CouponController as UserCouponController;
use App\Http\Controllers\User\UserAddressController;

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;

// Public Routes
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
// Route::get('products/{id}/reviews', [ProductController::class, 'reviews']);

Route::get('categories', [PublicCategoryController::class, 'index']);
Route::get('categories/{id}', [PublicCategoryController::class, 'show']);
Route::get('stores', [\App\Http\Controllers\StoreController::class, 'index']);

// VNPay Callbacks
Route::get('vnpay-return', [UserOrderController::class, 'vnpayReturn']);
Route::any('vnpay-ipn', [UserOrderController::class, 'vnpayIpn']);

// User Auth
Route::post('auth/register', [UserAuthController::class, 'register']);
Route::post('auth/login', [UserAuthController::class, 'login']);

// Admin Auth
Route::post('admin/login', [AdminAuthController::class, 'login']);

// User Authenticated Routes
Route::middleware('auth.api')->group(function () {
    Route::post('auth/logout', [UserAuthController::class, 'logout']);
    Route::get('auth/me', [UserAuthController::class, 'me']);
    Route::put('auth/profile', [UserAuthController::class, 'updateProfile']);
    Route::put('auth/change-password', [UserAuthController::class, 'changePassword']);
    
    // User Cart
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'store']);
    Route::put('cart/{id}', [CartController::class, 'update']);
    Route::delete('cart/{id}', [CartController::class, 'destroy']);
    Route::delete('cart', [CartController::class, 'clear']);
    
    // User Orders
    Route::get('orders', [UserOrderController::class, 'index']);
    Route::get('orders/{id}', [UserOrderController::class, 'show']);
    Route::post('orders', [UserOrderController::class, 'store']);
    Route::patch('orders/{id}/cancel', [UserOrderController::class, 'cancel']);
    
    // User Coupons
    Route::post('coupons/check', [UserCouponController::class, 'check']);
    
    // User Reviews
    // Route::post('reviews', [UserReviewController::class, 'store']);
    
    // User Address
    Route::get('addresses', [UserAddressController::class, 'index']);
    Route::post('addresses', [UserAddressController::class, 'store']);
    Route::patch('addresses/{id}/default', [UserAddressController::class, 'setDefault']);
    Route::put('addresses/{id}', [UserAddressController::class, 'update']);
    Route::delete('addresses/{id}', [UserAddressController::class, 'destroy']);
});

// Admin Authenticated Routes
Route::middleware('auth.admin')->prefix('admin')->group(function () {
    Route::post('logout', [AdminAuthController::class, 'logout']);
    Route::get('me', [AdminAuthController::class, 'me']);

    // Admin Categories
    Route::apiResource('categories', CategoryController::class);
    Route::patch('categories/{id}/status', [CategoryController::class, 'updateStatus']);

    // Admin Products
    Route::apiResource('products', AdminProductController::class);
    Route::patch('products/{id}/status', [AdminProductController::class, 'updateStatus']);

    // Admin Orders
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{id}', [AdminOrderController::class, 'show']);
    Route::patch('orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    Route::patch('orders/{id}/payment-status', [AdminOrderController::class, 'updatePaymentStatus']);
    Route::get('orders/{id}/invoice', [AdminOrderController::class, 'invoice']);

    // Admin Users
    Route::apiResource('users', UserController::class);

    // Admin Coupons
    Route::apiResource('coupons', AdminCouponController::class);

    // Admin Reviews
    // Route::get('reviews', [AdminReviewController::class, 'index']);
    // Route::patch('reviews/{id}/approve', [AdminReviewController::class, 'approve']);

    // Admin Statistics
    Route::get('statistics/revenue', [StatisticsController::class, 'revenue']);
    Route::get('statistics/best-selling', [StatisticsController::class, 'bestSelling']);
    Route::get('statistics/overview', [StatisticsController::class, 'overview']);

    // Admin Stores
    Route::apiResource('stores', \App\Http\Controllers\StoreController::class);
    
    // Admin Employees (Admin Role Only)
    Route::middleware('admin.only')->group(function () {
        Route::apiResource('employees', EmployeeController::class);
    });
});