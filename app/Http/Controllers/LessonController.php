<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    public function store(Request $request, $moduleId)
    {
        $user = Auth::user();
        // Robust tenant resolution
        $tenantId = session('tenant_id') ?? $user->ownedTenants()->first()?->id;

        if (!$tenantId) {
             return response()->json(['message' => 'Académie non trouvée.'], 403);
        }
        
        $module = Module::whereHas('course', function($q) use($tenantId) { 
            $q->where('tenant_id', $tenantId); 
        })->findOrFail($moduleId);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:video,text,quiz'],
        ]);

        $maxOrder = $module->lessons()->max('sort_order') ?? 0;

        $lesson = $module->lessons()->create([
            'tenant_id' => $tenantId,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'slug' => \Illuminate\Support\Str::slug($validated['title']) . '-' . \Illuminate\Support\Str::random(4),
            'content' => '', // Empty initially
            'sort_order' => $maxOrder + 1
        ]);

        return response()->json($lesson);
    }

    public function update(Request $request, $lessonId)
    {
        $user = Auth::user();
        $tenantId = session('tenant_id') ?? $user->ownedTenants()->first()?->id;

        // Deep nested relationship check
        $lesson = Lesson::whereHas('module.course', function($q) use($tenantId) { 
            $q->where('tenant_id', $tenantId); 
        })->findOrFail($lessonId);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'], // Markdown or HTML
            'video_url' => ['nullable', 'string', 'max:500'],
            'type' => ['nullable', 'in:video,text,quiz'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['nullable', 'boolean']
        ]);

        $lesson->update($validated);

        return response()->json($lesson);
    }

    public function destroy($lessonId)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();
        
        $lesson = Lesson::whereHas('module.course', function($q) use($tenant) { 
            $q->where('tenant_id', $tenant->id); 
        })->findOrFail($lessonId);

        $lesson->delete();

        return response()->json(['message' => 'Leçon supprimée']);
    }
}
