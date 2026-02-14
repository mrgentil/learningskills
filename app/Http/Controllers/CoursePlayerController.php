<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Models\Tenant;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoursePlayerController extends Controller
{
    protected $enrollmentService;

    public function __construct(EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }

    /**
     * Show the main player for a course.
     * If no lesson slug is provided, it finds the first lesson or the last completed one.
     */
    public function show(string $academySlug, string $courseSlug, string $lessonSlug = null)
    {
        $user = Auth::user();
        
        // 1. Load active tenant
        $tenant = Tenant::where('slug', $academySlug)
            ->where('is_active', true)
            ->firstOrFail();

        // 2. Load course and check enrollment
        $course = Course::where('tenant_id', $tenant->id)
            ->where('slug', $courseSlug)
            ->where('status', 'published')
            ->firstOrFail();

        $isEnrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (!$isEnrolled) {
            return redirect()->route('course.show', [$tenant->slug, $course->slug])
                ->with('error', 'Vous devez être inscrit pour accéder à ce cours.');
        }

        // 3. Load curriculum (Modules > Lessons)
        $course->load(['modules.lessons' => function($q) {
            $q->orderBy('sort_order');
        }]);

        // 4. Identify the current lesson
        if ($lessonSlug) {
            $currentLesson = Lesson::where('slug', $lessonSlug)
                ->whereHas('module', function($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->firstOrFail();
        } else {
            // Find first lesson of course
            $firstModule = $course->modules->first();
            if (!$firstModule || $firstModule->lessons->isEmpty()) {
                return redirect()->route('course.show', [$tenant->slug, $course->slug])
                    ->with('error', 'Ce cours n\'a pas encore de contenu. Revenez bientôt !');
            }
            $currentLesson = $firstModule->lessons->first();
        }

        // 5. Get completion status for all lessons in this course for this user
        $completions = LessonCompletion::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->pluck('lesson_id')
            ->toArray();

        return view('academy.player', compact('tenant', 'course', 'currentLesson', 'completions'));
    }

    /**
     * Mark a lesson as complete via AJAX.
     */
    public function complete(Request $request, $lessonId)
    {
        $user = Auth::user();
        $lesson = Lesson::findOrFail($lessonId);
        $courseId = $lesson->module->course_id;

        // Ensure user is enrolled
        $isEnrolled = $user->enrollments()
            ->where('course_id', $courseId)
            ->where('status', 'active')
            ->exists();

        if (!$isEnrolled) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Create or get completion
        LessonCompletion::firstOrCreate([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'course_id' => $courseId,
            'tenant_id' => $lesson->tenant_id
        ]);

        // Calculate new progress
        $newProgress = $this->enrollmentService->updateProgress($user, $lesson->module->course);

        // Find next lesson for auto-redirect or suggestion
        $allLessons = $lesson->module->course->modules->flatMap->lessons;
        $currentIndex = $allLessons->search(fn($l) => $l->id == $lesson->id);
        $nextLesson = ($currentIndex !== false && $currentIndex < $allLessons->count() - 1) 
            ? $allLessons[$currentIndex + 1] 
            : null;
        
        $nextLessonUrl = $nextLesson 
            ? route('course.learn', [$lesson->tenant->slug, $lesson->module->course->slug, $nextLesson->slug])
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Leçon marquée comme terminée',
            'progress' => $newProgress,
            'next_lesson_url' => $nextLessonUrl
        ]);
    }
}
