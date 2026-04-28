<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tag' => 'nullable|in:sale,hot,new,',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'nutritional_info' => 'nullable|string',
            'status' => 'required|in:in_stock,out_of_stock',
            'is_featured' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Vui lòng chọn danh mục',
            'category_id.exists'   => 'Danh mục không hợp lệ',
            'name.required'        => 'Vui lòng nhập tên sản phẩm',
            'name.max'             => 'Tên sản phẩm không được vượt quá 255 ký tự',
            'price.required'       => 'Vui lòng nhập giá sản phẩm',
            'price.numeric'        => 'Giá sản phẩm phải là số',
            'price.min'            => 'Giá sản phẩm phải lớn hơn hoặc bằng 0',
            'old_price.numeric'    => 'Giá gốc phải là số',
            'old_price.min'        => 'Giá gốc phải lớn hơn hoặc bằng 0',
            'discount.numeric'     => 'Giảm giá phải là số',
            'discount.min'         => 'Giảm giá phải lớn hơn hoặc bằng 0',
            'img.image'            => 'Ảnh không hợp lệ',
            'img.mimes'            => 'Ảnh chỉ được phép là jpeg, png, jpg, gif',
            'img.max'              => 'Ảnh không được vượt quá 2MB',
            'quantity.required'    => 'Vui lòng nhập số lượng',
            'quantity.integer'     => 'Số lượng phải là số nguyên',
            'quantity.min'         => 'Số lượng phải lớn hơn hoặc bằng 0',
            'status.required'      => 'Vui lòng chọn trạng thái sản phẩm',
            'status.in'            => 'Trạng thái sản phẩm không hợp lệ',
        ];
    }
}
