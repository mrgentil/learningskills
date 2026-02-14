<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Tenant;
use Illuminate\Http\Request;

class AcademyController extends Controller
{
    /**
     * Display the public page of an academy.
     * Route: /academy/{slug}
     */
    public function show(string $slug)
    {
        // 1. Load active tenant. 
        // We use firstOrFail to throw 404 if not found or inactive.
        $tenant = Tenant::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // 2. Load published courses for this tenant.
        // The BelongsToTenant trait handles global scopes, 
        // but since this is a public page where tenant_id is NOT in session,
        // we must manually ensure we scope it to the loaded tenant.
        $courses = Course::where('tenant_id', $tenant->id)
            ->where('status', 'published')
            ->latest()
            ->take(6)
            ->get();

        $totalCoursesCount = Course::where('tenant_id', $tenant->id)
            ->where('status', 'published')
            ->count();

        $pages = $tenant->pages()->where('is_published', true)->get();

        return view('academy.show', compact('tenant', 'courses', 'totalCoursesCount', 'pages'));
    }

    /**
     * Display the public page of a specific course.
     * Route: /academy/{academy_slug}/course/{course_slug}
     */
    public function course(string $academySlug, string $courseSlug)
    {
        // 1. Load active tenant.
        $tenant = Tenant::where('slug', $academySlug)
            ->where('is_active', true)
            ->firstOrFail();

        // 2. Load published course belonging to this tenant.
        // We use firstOrFail to ensure it's not a draft and belongs to this tenant.
        $course = Course::where('tenant_id', $tenant->id)
            ->where('slug', $courseSlug)
            ->where('status', 'published')
            ->firstOrFail();

        return view('academy.course', compact('tenant', 'course'));
    }

    /**
     * Display all courses of an academy.
     * Route: /academy/{slug}/courses
     */
    public function courses(string $slug)
    {
        $tenant = Tenant::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $courses = Course::where('tenant_id', $tenant->id)
            ->where('status', 'published')
            ->latest()
            ->paginate(12);

        $pages = $tenant->pages()->where('is_published', true)->get();

        return view('academy.courses', compact('tenant', 'courses', 'pages'));
    }
}
