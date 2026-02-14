<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModuleController extends Controller
{
    public function store(Request $request, $courseId)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();
        $course = $tenant->courses()->findOrFail($courseId);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        // Calculate next order index
        $maxOrder = $course->modules()->max('order_index') ?? 0;

        $module = $course->modules()->create([
            'title' => $validated['title'],
            'order_index' => $maxOrder + 1
        ]);

        return response()->json($module);
    }

    public function update(Request $request, $moduleId)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();
        // Verify ownership through course relation if needed, or simpler:
        // We assume module belongs to a course owned by tenant
        // A better check would be: Module::whereHas('course', function($q) use($tenant) { $q->where('tenant_id', $tenant->id); })->findOrFail($moduleId);
        
        $module = Module::whereHas('course', function($q) use($tenant) { 
            $q->where('tenant_id', $tenant->id); 
        })->findOrFail($moduleId);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $module->update($validated);

        return response()->json($module);
    }

    public function destroy($moduleId)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();
        
        $module = Module::whereHas('course', function($q) use($tenant) { 
            $q->where('tenant_id', $tenant->id); 
        })->findOrFail($moduleId);

        $module->delete();

        return response()->json(['message' => 'Module supprimé']);
    }
}
