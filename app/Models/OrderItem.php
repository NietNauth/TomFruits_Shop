<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'product_name',
        'product_img',
    ];

    protected $appends = ['product_image_url'];

    public function getProductImageUrlAttribute()
    {
        if (!$this->product_img) {
            return null;
        }
        if (filter_var($this->product_img, FILTER_VALIDATE_URL)) {
            return $this->product_img;
        }
        return url(\Illuminate\Support\Facades\Storage::url($this->product_img));
    }

    public $timestamps = false; // "order_items (id, order_id, product_id, quantity, price, product_name, product_img)"

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
