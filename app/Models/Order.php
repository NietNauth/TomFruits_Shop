<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'user_id',
        'coupon_id',
        'total_price',
        'discount_amount',
        'shipping_fee',
        'final_price',
        'status',
        'payment_method',
        'payment_status',
        'receiver_name',
        'receiver_phone',
        'shipping_address',
        'note',
    ];

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->order_code = 'TF-' . strtoupper(\Illuminate\Support\Str::random(8));
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
