<?php

namespace App\Services;

use App\Models\Tenant;
use Exception;

class PlanLimitService
{
    /**
     * Check if a tenant can create a new course based on their plan limits.
     *
     * @param Tenant $tenant
     * @return bool
     * @throws Exception
     */
    public function canCreateCourse(Tenant $tenant): bool
    {
        $plan = $tenant->plan;

        if (!$plan) {
            throw new Exception("Aucun plan n'est associé à cette académie.");
        }

        // If max_courses is 0, we treat it as infinite or specifically handled
        // For this implementation, we assume 0 is a placeholder, but the seeder sets 30 for Pro.
        if ($plan->max_courses > 0) {
            $currentCourseCount = $tenant->courses()->count();

            if ($currentCourseCount >= $plan->max_courses) {
                return false;
            }
        }

        return true;
    }
}
