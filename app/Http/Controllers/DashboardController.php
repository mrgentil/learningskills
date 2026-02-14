<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Return real stats scoped to the current user's tenant.
     */
    public function stats()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Super Admin — platform-wide stats
        if ($user->is_super_admin) {
            return response()->json($this->superAdminStats());
        }

        // Resolve tenant
        $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();

        if (!$tenant) {
            return response()->json($this->emptyStats());
        }

        $role = 'student';
        $tenantUser = $user->tenants()->where('tenants.id', $tenant->id)->first();
        if ($tenantUser) {
            $role = $tenantUser->pivot->role;
        }
        if ($user->ownedTenants()->where('tenants.id', $tenant->id)->exists()) {
            $role = 'owner';
        }

        if ($role === 'owner') {
            return response()->json($this->ownerStats($tenant));
        }

        if ($role === 'instructor') {
            return response()->json($this->instructorStats($tenant, $user));
        }

        return response()->json($this->studentStats($tenant, $user));
    }

    private function superAdminStats(): array
    {
        $totalTenants = Tenant::where('is_active', true)->count();
        $totalUsers = \App\Models\User::count();
        $totalCourses = Course::count();
        $totalRevenue = Tenant::sum('total_revenue');

        return [
            'role' => 'super_admin',
            'cards' => [
                ['label' => 'Revenu Plateforme', 'value' => '$' . number_format($totalRevenue, 0), 'icon' => 'fa-globe', 'color' => '#ff007a'],
                ['label' => 'Académies Actives', 'value' => (string) $totalTenants, 'icon' => 'fa-university', 'color' => '#6a11cb'],
                ['label' => 'Total Utilisateurs', 'value' => number_format($totalUsers, 0), 'icon' => 'fa-user-secret', 'color' => '#2575fc'],
                ['label' => 'Total Cours', 'value' => (string) $totalCourses, 'icon' => 'fa-book', 'color' => '#48bb78'],
            ],
            'chart_revenue' => $this->monthlyRevenue(null),
            'chart_students' => $this->weeklyEnrollments(null),
        ];
    }

    private function ownerStats(Tenant $tenant): array
    {
        $courses = Course::where('tenant_id', $tenant->id);
        $enrollments = Enrollment::where('tenant_id', $tenant->id);
        $students = $tenant->users()->wherePivot('role', 'student')->count();
        $publishedCourses = (clone $courses)->where('status', 'published')->count();
        $totalCourses = $courses->count();
        $totalRevenue = (clone $courses)->sum('total_revenue');
        $totalEnrollments = $enrollments->count();

        return [
            'role' => 'owner',
            'cards' => [
                ['label' => 'Revenu Total', 'value' => '$' . number_format($totalRevenue, 0), 'icon' => 'fa-money', 'color' => '#ff007a'],
                ['label' => 'Étudiants', 'value' => (string) $students, 'icon' => 'fa-users', 'color' => '#6a11cb'],
                ['label' => 'Cours Publiés', 'value' => $publishedCourses . '/' . $totalCourses, 'icon' => 'fa-book', 'color' => '#2575fc'],
                ['label' => 'Inscriptions', 'value' => (string) $totalEnrollments, 'icon' => 'fa-line-chart', 'color' => '#48bb78'],
            ],
            'chart_revenue' => $this->monthlyRevenue($tenant->id),
            'chart_students' => $this->weeklyEnrollments($tenant->id),
        ];
    }

    private function instructorStats(Tenant $tenant, $user): array
    {
        $tenantUser = DB::table('tenant_user')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->first();

        $courses = Course::where('tenant_id', $tenant->id)
            ->where('instructor_id', $tenantUser?->id ?? 0);
        $courseIds = (clone $courses)->pluck('id');
        $totalCourses = $courses->count();
        $totalStudents = Enrollment::whereIn('course_id', $courseIds)->distinct('user_id')->count('user_id');
        $totalRevenue = (clone $courses)->sum('total_revenue');

        return [
            'role' => 'instructor',
            'cards' => [
                ['label' => 'Mes Étudiants', 'value' => (string) $totalStudents, 'icon' => 'fa-users', 'color' => '#6a11cb'],
                ['label' => 'Mes Cours', 'value' => (string) $totalCourses, 'icon' => 'fa-book', 'color' => '#2575fc'],
                ['label' => 'Note Globale', 'value' => '-', 'icon' => 'fa-star', 'color' => '#f6ad55'],
                ['label' => 'Revenus', 'value' => '$' . number_format($totalRevenue, 0), 'icon' => 'fa-shopping-cart', 'color' => '#ff007a'],
            ],
            'chart_revenue' => $this->monthlyRevenue($tenant->id),
            'chart_students' => $this->weeklyEnrollments($tenant->id),
        ];
    }

    private function studentStats(Tenant $tenant, $user): array
    {
        $enrollments = Enrollment::where('tenant_id', $tenant->id)->where('user_id', $user->id);
        $totalEnrolled = (clone $enrollments)->count();
        $completed = (clone $enrollments)->where('status', 'completed')->count();
        $avgProgress = (clone $enrollments)->avg('progress_percent') ?? 0;

        return [
            'role' => 'student',
            'cards' => [
                ['label' => 'Cours en cours', 'value' => (string) $totalEnrolled, 'icon' => 'fa-play-circle', 'color' => '#2575fc'],
                ['label' => 'Complétés', 'value' => (string) $completed, 'icon' => 'fa-certificate', 'color' => '#ff007a'],
                ['label' => 'Progression', 'value' => round($avgProgress) . '%', 'icon' => 'fa-tasks', 'color' => '#6a11cb'],
                ['label' => 'Certificats', 'value' => (string) $completed, 'icon' => 'fa-trophy', 'color' => '#48bb78'],
            ],
            'chart_revenue' => ['labels' => [], 'data' => []],
            'chart_students' => ['labels' => [], 'data' => []],
        ];
    }

    private function emptyStats(): array
    {
        return [
            'role' => 'owner',
            'cards' => [
                ['label' => 'Revenu Total', 'value' => '$0', 'icon' => 'fa-money', 'color' => '#ff007a'],
                ['label' => 'Étudiants', 'value' => '0', 'icon' => 'fa-users', 'color' => '#6a11cb'],
                ['label' => 'Cours Publiés', 'value' => '0', 'icon' => 'fa-book', 'color' => '#2575fc'],
                ['label' => 'Inscriptions', 'value' => '0', 'icon' => 'fa-line-chart', 'color' => '#48bb78'],
            ],
            'chart_revenue' => ['labels' => [], 'data' => []],
            'chart_students' => ['labels' => [], 'data' => []],
        ];
    }

    /**
     * Monthly revenue for the last 7 months.
     */
    private function monthlyRevenue(?int $tenantId): array
    {
        $labels = [];
        $data = [];
        $months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = $months[$date->month - 1];

            $query = Enrollment::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month);

            if ($tenantId) {
                $query->where('tenant_id', $tenantId);
            }

            // Use enrollment count as proxy for revenue (no payment table yet)
            $data[] = $query->count();
        }

        return ['labels' => $labels, 'data' => $data];
    }

    /**
     * Weekly enrollments for the last 7 days.
     */
    private function weeklyEnrollments(?int $tenantId): array
    {
        $labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        $data = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);

            $query = Enrollment::whereDate('created_at', $date->toDateString());

            if ($tenantId) {
                $query->where('tenant_id', $tenantId);
            }

            $data[] = $query->count();
        }

        return ['labels' => $labels, 'data' => $data];
    }
}
