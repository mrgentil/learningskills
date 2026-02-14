<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use \App\Traits\BelongsToTenant, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'instructor_id',
        'category_id',
        'title',
        'slug',
        'short_description',
        'description',
        'thumbnail',
        'price',
        'is_free',
        'status',
        'seo_title',
        'seo_description',
        'platform_commission_rate',
        'total_enrollments',
        'total_revenue',
        'level',
    ];

    public function instructor()
    {
        return $this->belongsTo(TenantUser::class, 'instructor_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('sort_order');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->hasMany(Enrollment::class);
    }
}
