<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'price',
        'old_price',
        'discount',
        'tag',
        'img',
        'unit',
        'weight',
        'quantity',
        'description',
        'nutritional_info',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        $img = $this->img;
        if (!$img) {
            return null;
        }
        
        // Tối ưu check chuỗi bắt đầu thay vì filter_var
        if (str_starts_with($img, 'http')) {
            return $img;
        }

        // Sử dụng asset trực tiếp, nhanh hơn Storage::url
        return asset('storage/' . $img);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
