<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tag' => 'nullable|in:sale,hot,new,',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'quantity' => 'sometimes|integer|min:0',
            'description' => 'nullable|string',
            'nutritional_info' => 'nullable|string',
            'status' => 'sometimes|in:in_stock,out_of_stock',
            'is_featured' => 'nullable|boolean',
        ];
    }
}
