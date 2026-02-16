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
        // Robust tenant resolution: session (set by middleware) or fallback to owned
        $tenantId = session('tenant_id') ?? $user->ownedTenants()->first()?->id;
        
        if (!$tenantId) {
            return response()->json(['message' => 'Académie non trouvée ou session expirée.'], 403);
        }

        $course = Course::where('tenant_id', $tenantId)->findOrFail($courseId);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        // Calculate next order index (sort_order is the correct field name)
        $maxOrder = $course->modules()->max('sort_order') ?? 0;

        $module = $course->modules()->create([
            'tenant_id' => $tenantId, // Ensure it's passed if trait doesn't pick it up
            'title' => $validated['title'],
            'sort_order' => $maxOrder + 1
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
