<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'pricing_type',
        'tier',
        'stripe_plan_id',
        'price',
        'setup_price',
        'maintenance_price',
        'interval',
        'description',
        'max_courses',
        'max_students',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'setup_price' => 'decimal:2',
        'maintenance_price' => 'decimal:2',
    ];

    public function isOneTime(): bool
    {
        return $this->pricing_type === 'one_time';
    }

    public function isRecurring(): bool
    {
        return $this->pricing_type === 'recurring';
    }

    public function tenants()
    {
        return $this->hasMany(Tenant::class);
    }
}
