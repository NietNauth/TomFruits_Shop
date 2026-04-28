<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'coupon_code' => 'nullable|string|exists:coupons,code',
            'payment_method' => 'required|in:cod,bank,vnpay',
            'receiver_name' => 'required|string|max:255',
            'receiver_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'note' => 'nullable|string',
        ];
    }
}
