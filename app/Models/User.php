<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->avatar) {
             return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random';
        }
        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }
        return url(\Illuminate\Support\Facades\Storage::url($this->avatar));
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Get the user's addresses.
     */
    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }
}
