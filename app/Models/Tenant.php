<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'owner_id',
        'plan_id',
        'name',
        'slug',
        'custom_domain',
        'stripe_connect_id',
        'total_students',
        'total_revenue',
        'data',
        'is_active',
    ];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'tenant_user')
            ->withPivot('role', 'status', 'joined_at')
            ->withTimestamps();
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function pages()
    {
        return $this->hasMany(Page::class);
    }

    public function licenses()
    {
        return $this->hasMany(TenantLicense::class)->orderByDesc('expires_at');
    }

    /**
     * Licence active (en cours de validité) pour ce tenant, s'il y en a une.
     */
    public function activeLicense()
    {
        return $this->hasOne(TenantLicense::class)
            ->where('status', 'active')
            ->where('starts_at', '<=', now()->toDateString())
            ->where(function ($query) {
                $query->where('expires_at', '>=', now()->toDateString())
                      ->orWhereNull('expires_at');
            })
            ->latest('expires_at');
    }
}
