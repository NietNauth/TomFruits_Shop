<?php

namespace App\Services;

use App\Models\Coupon;
use Exception;
use Illuminate\Support\Carbon;

class CouponService
{
    public function checkValidity(Coupon $coupon, $orderTotal)
    {
        if (!$coupon->is_active) {
            throw new Exception('Coupon is not active.');
        }

        if ($coupon->start_date && Carbon::now()->lt($coupon->start_date)) {
            throw new Exception('Coupon is not valid yet.');
        }

        if ($coupon->end_date && Carbon::now()->gt($coupon->end_date)) {
            throw new Exception('Coupon has expired.');
        }

        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            throw new Exception('Coupon usage limit reached.');
        }

        if ($coupon->min_order_value && $orderTotal < $coupon->min_order_value) {
            throw new Exception("Order total must be at least {$coupon->min_order_value} to use this coupon.");
        }

        return true;
    }

    public function calculateDiscount(Coupon $coupon, $orderTotal)
    {
        $this->checkValidity($coupon, $orderTotal);

        $discount = 0;

        if ($coupon->discount_type === 'percent') {
            $discount = ($orderTotal * $coupon->discount_value) / 100;
            if ($coupon->max_discount && $discount > $coupon->max_discount) {
                $discount = $coupon->max_discount;
            }
        } elseif ($coupon->discount_type === 'fixed') {
            $discount = $coupon->discount_value;
        }

        return min($discount, $orderTotal); // Discount cannot exceed order total
    }
}
