<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CategoryUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:150|unique:categories,title,' . $this->route('category'),
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'nullable|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Vui lòng nhập tên danh mục',
            'title.string'   => 'Tên danh mục không hợp lệ',
            'title.max'      => 'Tên danh mục không được vượt quá 150 ký tự',
            'title.unique'   => 'Tên danh mục đã tồn tại',
            'img.image'      => 'Ảnh không hợp lệ',
            'img.mimes'      => 'Ảnh chỉ được phép là jpeg, png, jpg, gif',
            'img.max'        => 'Ảnh không được vượt quá 2MB',
        ];
    }
}
