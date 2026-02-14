<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class EnrollmentService
{
    /**
     * Enroll a user into a course.
     */
    public function enroll(User $user, Course $course)
    {
        return DB::transaction(function () use ($user, $course) {
            // 1. Verify existence of enrollment to prevent duplicates
            $existing = Enrollment::where('tenant_id', $course->tenant_id)
                ->where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();

            if ($existing) {
                return $existing;
            }

            // 2. Ensure User has 'student' role in this tenant (if not owner/instructor)
            $this->ensureStudentRole($user, $course->tenant_id);

            // 3. Create the enrollment
            $enrollment = Enrollment::create([
                'tenant_id'        => $course->tenant_id,
                'user_id'          => $user->id,
                'course_id'        => $course->id,
                'status'           => 'active',
                'progress_percent' => 0,
                'enrolled_at'      => now(),
            ]);

            // 4. Update course stats (optional but good for performance)
            $course->increment('total_enrollments');

            return $enrollment;
        });
    }

    /**
     * Ensure the user has at least a student role for the given tenant.
     * Does NOT override existing owner/instructor roles.
     */
    protected function ensureStudentRole(User $user, int $tenantId)
    {
        // Check if relationship already exists
        $exists = $user->tenants()->where('tenant_id', $tenantId)->exists();

        if (!$exists) {
            $user->tenants()->attach($tenantId, [
                'role'      => 'student',
                'status'    => 'active',
                'joined_at' => now(),
            ]);
        }
    }
}
