<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'district',
        'phone',
        'opening_hours',
        'image_url',
        'is_active',
    ];
}
