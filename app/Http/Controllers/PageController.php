<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant = Auth::user()->ownedTenants()->first();
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        return response()->json($tenant->pages()->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $tenant = Auth::user()->ownedTenants()->first();
        if (!$tenant) {
            return response()->json(['error' => 'Tenant not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean',
            'show_in_nav' => 'boolean',
            'meta_description' => 'nullable|string|max:255',
        ]);

        // Auto slug from title if not unique, handled in model but ensuring here or model boot
        $page = $tenant->pages()->create($validated);

        return response()->json($page, 201);
    }

    /**
     * Display the specified resource (Admin View).
     */
    public function show(string $id)
    {
        $tenant = Auth::user()->ownedTenants()->first();
        $page = $tenant->pages()->findOrFail($id);
        return response()->json($page);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tenant = Auth::user()->ownedTenants()->first();
        $page = $tenant->pages()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean',
            'show_in_nav' => 'boolean',
            'meta_description' => 'nullable|string|max:255',
        ]);
        
        // If title changes, should we update slug? Usually yes for SEO if early, no if established. 
        // For simplicity, let's keep slug stable or allow manual slug updates later.
        
        $page->update($validated);

        return response()->json($page);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tenant = Auth::user()->ownedTenants()->first();
        $page = $tenant->pages()->findOrFail($id);
        $page->delete();

        return response()->json(['message' => 'Page deleted']);
    }

    /**
     * Public Method to view a page content by slug
     */
    public function publicPage($tenantSlug, $pageSlug)
    {
        $tenant = \App\Models\Tenant::where('slug', $tenantSlug)->firstOrFail();
        $page = $tenant->pages()
            ->where('slug', $pageSlug)
            ->where('is_published', true)
            ->firstOrFail();

        $pages = $tenant->pages()->where('is_published', true)->get();

        return view('academy.page', compact('tenant', 'page', 'pages'));
    }
}
