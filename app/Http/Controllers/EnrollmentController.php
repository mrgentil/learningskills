<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    protected $enrollmentService;

    public function __construct(EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }

    /**
     * Handle enrollment request.
     */
    public function enroll(Request $request, $courseId)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('info', 'Veuillez vous connecter pour vous inscrire.');
        }

        // 1. Find the course and verify it is published
        // We scope by tenant naturally if BelongsToTenant is in session, 
        // but since this is from a public link, we find by ID first.
        $course = Course::findOrFail($courseId);

        if ($course->status !== 'published') {
            abort(404, 'Cours non disponible.');
        }

        // 2. Logic for paid vs free
        if (!$course->is_free && $course->price > 0) {
            // SIMULATION: In a real scenario, redirect to Stripe/Payment
            // For now, we assume payment success.
        }

        // 3. Process enrollment via service (handles transaction, roles, duplicates)
        $this->enrollmentService->enroll($user, $course);

        return redirect()->route('dashboard.my-courses')
            ->with('success', 'Félicitations ! Vous êtes inscrit au cours.');
    }
    /**
     * Get the authenticated user's enrolled courses.
     * API for React frontend.
     */
    public function myCourses()
    {
        $user = Auth::user();

        // Load enrollments with courses, scoped by current tenant in session
        // Note: The BelongsToTenant trait on Enrollment model will auto-filter by tenant_id if present in session.
        $enrollments = $user->enrollments()
            ->with('course')
            ->where('status', 'active')
            ->latest('enrolled_at')
            ->get();

        return response()->json($enrollments->map(function ($e) {
            return [
                'id' => $e->id,
                'course_id' => $e->course_id,
                'title' => $e->course->title,
                'progress' => $e->progress_percent,
                'instructor' => 'Instructeur Académie', // Simplified for now
                'img' => $e->course->thumbnail ?? 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                'course_slug' => $e->course->slug,
                'academy_slug' => $e->course->tenant->slug,
            ];
        }));
    }
}
