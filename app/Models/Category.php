<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'img',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        $img = $this->img;
        if (!$img) {
            return null;
        }
        
        if (str_starts_with($img, 'http')) {
            return $img;
        }

        return asset('storage/' . $img);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
