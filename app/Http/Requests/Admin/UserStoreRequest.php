<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'avatar' => 'nullable|string',
            'is_active' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Vui lòng nhập họ tên khách hàng',
            'name.max'          => 'Họ tên không được vượt quá 255 ký tự',
            'email.required'    => 'Vui lòng nhập email',
            'email.email'       => 'Email không hợp lệ',
            'email.max'         => 'Email không được vượt quá 255 ký tự',
            'email.unique'      => 'Email đã tồn tại',
            'password.required' => 'Vui lòng nhập mật khẩu',
            'password.min'      => 'Mật khẩu phải có ít nhất 6 ký tự',
        ];
    }
}
