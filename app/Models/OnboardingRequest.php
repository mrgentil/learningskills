<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_name',
        'contact_name',
        'email',
        'phone',
        'timezone',
        'academy_name',
        'logo_path',
        'brand_colors',
        'custom_domain',
        'domain_name',
        'training_types',
        'content_types',
        'wants_certificates',
        'estimated_learners',
        'registration_mode',
        'will_sell_courses',
        'has_stripe',
        'enabled_features',
        'content_readiness',
        'target_launch_date',
        'comments',
        'selected_plan',
        'payment_method',
        'status',
        'deployed_at',
        'academy_url',
    ];

    protected $casts = [
        'training_types' => 'array',
        'content_types' => 'array',
        'enabled_features' => 'array',
        'brand_colors' => 'array',
        'custom_domain' => 'boolean',
        'wants_certificates' => 'boolean',
        'will_sell_courses' => 'boolean',
        'has_stripe' => 'boolean',
        'target_launch_date' => 'date',
        'deployed_at' => 'datetime',
    ];
}
