<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EnrollmentService
{
    /**
     * Enroll a user into a course.
     */
    public function enroll(User $user, Course $course)
    {
        return DB::transaction(function () use ($user, $course) {
            // 0. Quota : vérifier la limite d'étudiants du plan
            $tenant = $course->tenant ?? \App\Models\Tenant::with('plan')->find($course->tenant_id);
            if ($tenant && $tenant->plan_id) {
                $quota = app(\App\Services\QuotaService::class);
                if (!$quota->canEnrollStudent($tenant, $user->id)) {
                    throw new \App\Exceptions\QuotaLimitException('Limite d\'étudiants atteinte pour cette académie.');
                }
            }

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
     * Update the progress percentage for a user's enrollment in a course.
     */
    public function updateProgress(User $user, Course $course)
    {
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) return;

        // Total lessons in course
        $totalLessons = $course->modules()->withCount('lessons')->get()->sum('lessons_count');
        
        // Completed lessons for this user in this course
        $completedLessons = \App\Models\LessonCompletion::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->count();

        $progress = $totalLessons > 0 ? min(100, round(($completedLessons / $totalLessons) * 100)) : 0;

        $completedAt = ($progress == 100) ? now() : null;

        $enrollment->update([
            'progress_percent' => $progress,
            'status' => ($progress == 100) ? 'completed' : $enrollment->status,
            'completed_at' => $completedAt,
        ]);

        // Générer un certificat automatiquement à 100 %
        if ($progress == 100 && !$enrollment->certificate) {
            Certificate::create([
                'tenant_id' => $enrollment->tenant_id,
                'enrollment_id' => $enrollment->id,
                'certificate_uuid' => Str::uuid(),
                'issued_at' => now(),
            ]);
        }

        return $progress;
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
