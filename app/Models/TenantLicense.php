<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class TenantLicense extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'starts_at',
        'expires_at',
        'renewed_at',
        'maintenance_included',
        'rights',
        'status',
        'notes',
    ];

    protected $casts = [
        'starts_at' => 'date',
        'expires_at' => 'date',
        'renewed_at' => 'date',
        'maintenance_included' => 'boolean',
        'rights' => 'array',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * La licence est-elle en cours de validité ?
     */
    public function isActive(): bool
    {
        if ($this->status === 'expired') {
            return false;
        }
        $today = Carbon::today();
        return $this->starts_at->lte($today) && $this->expires_at->gte($today);
    }

    /**
     * Prolonger d'une année (renouvellement).
     */
    public function renewForOneYear(): self
    {
        $newExpires = $this->expires_at->copy()->addYear();
        $this->update([
            'expires_at' => $newExpires,
            'renewed_at' => now(),
            'status' => 'active',
        ]);
        return $this;
    }

    /**
     * Vérifie si un droit est accordé (ex: unlimited_courses).
     */
    public function hasRight(string $right): bool
    {
        $rights = $this->rights ?? [];
        return in_array($right, $rights, true);
    }
}
