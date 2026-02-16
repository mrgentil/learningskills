<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Tenant;
use App\Services\QuotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    /**
     * List all courses for the current academy.
     */
    public function index()
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();

        if (!$tenant) {
            return response()->json(['error' => 'Academy not found'], 404);
        }

        $courses = $tenant->courses()
            ->withCount(['students', 'modules', 'lessons'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($courses);
    }

    /**
     * Store a new course.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $tenantId = session('tenant_id') ?? $user->ownedTenants()->first()?->id;

        if (!$tenantId) {
            return response()->json(['error' => 'Academy not found or permission denied'], 403);
        }

        $tenant = Tenant::with('plan')->findOrFail($tenantId);

        $quota = app(QuotaService::class);
        if (!$quota->canCreateCourse($tenant)) {
            $usage = $quota->getUsage($tenant);
            return response()->json([
                'message' => 'Limite de cours atteinte pour votre plan.',
                'limit_reached' => true,
                'quota' => $usage,
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $course = $tenant->courses()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(4),
            'price' => $validated['price'],
            'status' => 'draft', // Default status
            'is_free' => $validated['price'] == 0,
            'description' => '',
            'short_description' => '',
        ]);

        return response()->json([
            'message' => 'Cours créé avec succès.',
            'course' => $course
        ]);
    }

    /**
     * Get a single course with modules and lessons.
     */
    public function show($id)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first() ?? $user->tenants()->first();

        $course = $tenant->courses()
            ->with(['modules.lessons'])
            ->findOrFail($id);
            
        // Append is_published attribute for frontend convenience
        $course->setAttribute('is_published', $course->status === 'published');

        return response()->json($course);
    }

    /**
     * Update course details.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        $course = $tenant->courses()->findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'], // Keep validation for input
            'thumbnail' => ['nullable', 'image', 'max:4096'],
        ]);

        // Map request data to model fields
        $data = [
            'title' => $validated['title'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? '',
            'short_description' => $validated['short_description'] ?? '',
        ];

        if (isset($validated['is_published'])) {
            $data['status'] = $validated['is_published'] ? 'published' : 'draft';
        }
        
        $data['is_free'] = $validated['price'] == 0;

        $course->fill($data);

        if ($request->hasFile('thumbnail')) {
            // Check if Cloudinary is configured (env file has CLOUDINARY_URL)
            if (env('CLOUDINARY_URL')) {
                 $path = $request->file('thumbnail')->storeOnCloudinary('academies/' . $tenant->id . '/courses')->getSecurePath();
                 $course->thumbnail = $path;
            } else {
                 // Fallback to local storage
                 $path = $request->file('thumbnail')->store('courses', 'public');
                 $course->thumbnail = '/storage/' . $path;
            }
        }

        $course->save();
        
        // Append is_published for response
        $course->setAttribute('is_published', $course->status === 'published');

        return response()->json([
            'message' => 'Cours mis à jour.',
            'course' => $course
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();
        $course = $tenant->courses()->findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Cours supprimé.']);
    }
}
