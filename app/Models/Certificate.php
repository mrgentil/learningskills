<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use \App\Traits\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'enrollment_id',
        'certificate_uuid',
        'issued_at',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
