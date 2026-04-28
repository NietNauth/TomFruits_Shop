<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CouponStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'code' => 'required|string|unique:coupons,code|max:50',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required'            => 'Vui lòng nhập mã giảm giá',
            'code.unique'              => 'Mã giảm giá đã tồn tại',
            'code.max'                 => 'Mã giảm giá không được vượt quá 50 ký tự',
            'discount_type.required'   => 'Vui lòng chọn loại giảm giá',
            'discount_type.in'         => 'Loại giảm giá không hợp lệ',
            'discount_value.required'  => 'Vui lòng nhập giá trị giảm',
            'discount_value.numeric'   => 'Giá trị giảm phải là số',
            'discount_value.min'       => 'Giá trị giảm phải lớn hơn hoặc bằng 0',
            'min_order_value.numeric'  => 'Giá trị đơn hàng tối thiểu phải là số',
            'min_order_value.min'      => 'Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0',
            'max_discount.numeric'     => 'Mức giảm tối đa phải là số',
            'usage_limit.integer'      => 'Giới hạn sử dụng phải là số nguyên',
            'usage_limit.min'          => 'Giới hạn sử dụng phải lớn hơn hoặc bằng 1',
            'end_date.after_or_equal'  => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
        ];
    }
}
