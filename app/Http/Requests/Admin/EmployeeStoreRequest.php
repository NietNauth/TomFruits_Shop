<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'avatar' => 'nullable|string',
            'role' => 'required|in:admin,manager,staff',
            'is_active' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Vui lòng nhập họ tên nhân viên',
            'name.max'          => 'Họ tên không được vượt quá 255 ký tự',
            'email.required'    => 'Vui lòng nhập email',
            'email.email'       => 'Email không hợp lệ',
            'email.max'         => 'Email không được vượt quá 255 ký tự',
            'email.unique'      => 'Email đã tồn tại',
            'password.required' => 'Vui lòng nhập mật khẩu',
            'password.min'      => 'Mật khẩu phải có ít nhất 6 ký tự',
            'role.required'     => 'Vui lòng chọn vai trò',
            'role.in'           => 'Vai trò không hợp lệ',
        ];
    }
}
