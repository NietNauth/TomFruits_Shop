<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($this->route('user'))],
            'password' => 'sometimes|string|min:6',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'avatar' => 'nullable|string',
            'is_active' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'name.max'      => 'Họ tên không được vượt quá 255 ký tự',
            'email.email'   => 'Email không hợp lệ',
            'email.unique'  => 'Email đã tồn tại',
            'password.min'  => 'Mật khẩu phải có ít nhất 6 ký tự',
        ];
    }
}
