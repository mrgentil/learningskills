<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPayment extends Model
{
    use \App\Traits\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'course_id',
        'amount',
        'currency',
        'platform_fee',
        'commission_amount',
        'payment_method',
        'stripe_payment_intent_id',
        'stripe_transfer_id',
        'status',
        'refunded_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
