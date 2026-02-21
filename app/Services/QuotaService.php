<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

/**
 * Gestion des quotas / licences par plan (cours, étudiants).
 * Convention : max_courses = 0 ou max_students = 0 = illimité.
 * Si le tenant a une licence annuelle active → droits étendus (illimité sauf si la licence précise autrement).
 */
class QuotaService
{
    /**
     * Vérifie si l'académie peut encore créer un cours.
     */
    public function canCreateCourse(Tenant $tenant): bool
    {
        $usage = $this->getUsage($tenant);
        if ($usage['courses_limit'] === null) {
            return true; // illimité
        }
        return $usage['courses_used'] < $usage['courses_limit'];
    }

    /**
     * Vérifie si l'académie peut encore inscrire un nouvel étudiant
     * (un nouvel user qui n'est pas encore inscrit à un cours du tenant).
     */
    public function canEnrollStudent(Tenant $tenant, ?int $existingUserId = null): bool
    {
        $usage = $this->getUsage($tenant);
        if ($usage['students_limit'] === null) {
            return true; // illimité
        }
        // Si l'utilisateur est déjà inscrit à au moins un cours, il ne consomme pas de nouvelle place
        if ($existingUserId && $this->tenantHasEnrollmentForUser($tenant, $existingUserId)) {
            return true;
        }
        return $usage['students_used'] < $usage['students_limit'];
    }

    /**
     * Le tenant a-t-il une licence annuelle (ou autre) en cours de validité ?
     */
    public function hasActiveLicense(Tenant $tenant): bool
    {
        $tenant->loadMissing('licenses');
        return $tenant->licenses->contains(fn ($l) => $l->isActive());
    }

    /**
     * Retourne l'usage actuel et les limites du plan (ou "Licence" si licence active).
     *
     * @return array{courses_used: int, courses_limit: int|null, students_used: int, students_limit: int|null, plan_name: string, license_active: bool}
     */
    public function getUsage(Tenant $tenant): array
    {
        $coursesUsed = $tenant->courses()->count();
        $studentsUsed = (int) Enrollment::withoutGlobalScopes()
            ->where('tenant_id', $tenant->id)
            ->count(DB::raw('DISTINCT user_id'));

        $license = $tenant->licenses()->where('status', 'active')->first();
        $activeLicense = $license && $license->isActive();
        $plan = $tenant->plan;

        // 1. Déterminer les limites (Priorité : Licence Override > Plan Default)
        $coursesLimit = null;
        $studentsLimit = null;

        if ($activeLicense) {
            // Si la licence a une valeur spécifique (non null), on l'utilise comme override
            $coursesLimit = $license->max_courses;
            $studentsLimit = $license->max_students;
        }

        // Si la licence n'a pas d'override, on tombe sur le Plan
        if ($coursesLimit === null && $plan) {
            $coursesLimit = $plan->max_courses;
        }
        if ($studentsLimit === null && $plan) {
            $studentsLimit = $plan->max_students;
        }

        // 2. Normalisation Final : 0 ou null => null (Illimité)
        $finalCoursesLimit = ((int)$coursesLimit <= 0) ? null : (int)$coursesLimit;
        $finalStudentsLimit = ((int)$studentsLimit <= 0) ? null : (int)$studentsLimit;

        $planName = $activeLicense ? ($license->name ?? 'Licence Active') : ($plan->name ?? 'Aucun plan');

        return [
            'courses_used' => $coursesUsed,
            'courses_limit' => $finalCoursesLimit,
            'students_used' => $studentsUsed,
            'students_limit' => $finalStudentsLimit,
            'plan_name' => $planName,
            'license_active' => $activeLicense,
        ];
    }

    private function tenantHasEnrollmentForUser(Tenant $tenant, int $userId): bool
    {
        return Enrollment::withoutGlobalScopes()
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $userId)
            ->exists();
    }
}
