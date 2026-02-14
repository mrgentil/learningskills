<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use \App\Traits\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'module_id',
        'title',
        'slug',
        'video_url',
        'content',
        'duration_minutes',
        'is_preview',
        'sort_order',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
