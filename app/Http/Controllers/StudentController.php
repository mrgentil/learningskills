<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Liste des étudiants de l'académie (utilisateurs inscrits à au moins un cours du tenant).
     */
    public function index()
    {
        $user = Auth::user();
        $tenantId = session('tenant_id') ?? $user->ownedTenants()->first()?->id ?? $user->tenants()->first()?->id;

        if (!$tenantId) {
            return response()->json(['error' => 'Académie non trouvée'], 404);
        }

        $students = User::query()
            ->select([
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COUNT(DISTINCT enrollments.course_id) as courses_count'),
                DB::raw('MIN(enrollments.enrolled_at) as first_enrolled'),
            ])
            ->join('enrollments', 'enrollments.user_id', '=', 'users.id')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->where('courses.tenant_id', $tenantId)
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('first_enrolled')
            ->get();

        return response()->json($students);
    }

    /**
     * Profil détaillé d'un étudiant (inscriptions, progression).
     */
    public function show($id)
    {
        $user = Auth::user();
        $tenantId = session('tenant_id') ?? $user->ownedTenants()->first()?->id ?? $user->tenants()->first()?->id;

        if (!$tenantId) {
            return response()->json(['error' => 'Académie non trouvée'], 404);
        }

        $student = User::select('id', 'name', 'email', 'created_at')
            ->whereHas('enrollments', function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            })
            ->findOrFail($id);

        $enrollments = $student->enrollments()
            ->where('tenant_id', $tenantId)
            ->with('course:id,title,slug,thumbnail')
            ->orderByDesc('enrolled_at')
            ->get()
            ->map(function ($e) {
                return [
                    'course_title' => $e->course->title,
                    'course_slug' => $e->course->slug,
                    'course_thumbnail' => $e->course->thumbnail,
                    'progress_percent' => $e->progress_percent ?? 0,
                    'status' => $e->status,
                    'enrolled_at' => $e->enrolled_at?->toIso8601String(),
                    'completed_at' => $e->completed_at?->toIso8601String(),
                ];
            });

        return response()->json([
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'created_at' => $student->created_at?->toIso8601String(),
            'enrollments' => $enrollments,
        ]);
    }
}
