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
        $tenant = $user->ownedTenants()->first();
        
        $module = Module::whereHas('course', function($q) use($tenant) { 
            $q->where('tenant_id', $tenant->id); 
        })->findOrFail($moduleId);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:video,text,quiz'],
        ]);

        $maxOrder = $module->lessons()->max('order_index') ?? 0;

        $lesson = $module->lessons()->create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'content' => '', // Empty initially
            'order_index' => $maxOrder + 1
        ]);

        return response()->json($lesson);
    }

    public function update(Request $request, $lessonId)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        // Deep nested relationship check or simple id check if trusted
        $lesson = Lesson::whereHas('module.course', function($q) use($tenant) { 
            $q->where('tenant_id', $tenant->id); 
        })->findOrFail($lessonId);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'], // Markdown or HTML
            'video_url' => ['nullable', 'url'],
            'is_published' => ['boolean']
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
