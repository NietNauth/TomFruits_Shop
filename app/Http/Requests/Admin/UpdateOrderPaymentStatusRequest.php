<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderPaymentStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'payment_status' => 'required|in:unpaid,paid'
        ];
    }

    public function messages(): array
    {
        return [
            'payment_status.required' => 'Vui lòng chọn trạng thái thanh toán',
            'payment_status.in'       => 'Trạng thái thanh toán không hợp lệ',
        ];
    }
}
