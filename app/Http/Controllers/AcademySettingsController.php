<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AcademySettingsController extends Controller
{
    /**
     * Get the current user's academy settings.
     */
    public function index()
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        if (!$tenant) {
            return response()->json(['error' => 'Academy not found'], 404);
        }

        return response()->json([
            'id' => $tenant->id,
            'name' => $tenant->name,
            'slug' => $tenant->slug,
            'description' => $tenant->data['description'] ?? '',
            'about' => $tenant->data['about'] ?? '',
            'footer_about' => $tenant->data['footer_about'] ?? '',
            'support_email' => $tenant->data['support_email'] ?? '',
            'support_phone' => $tenant->data['support_phone'] ?? '',
            'facebook_url' => $tenant->data['facebook_url'] ?? '',
            'instagram_url' => $tenant->data['instagram_url'] ?? '',
            'linkedin_url' => $tenant->data['linkedin_url'] ?? '',
            'twitter_url' => $tenant->data['twitter_url'] ?? '',
            'youtube_url' => $tenant->data['youtube_url'] ?? '',
            'logo_url' => $tenant->data['logo_url'] ?? null,
            'banner_url' => $tenant->data['banner_url'] ?? null,
            'favicon_url' => $tenant->data['favicon_url'] ?? null,
            'about_image' => $tenant->data['about_image'] ?? null,
            'experience_years' => $tenant->data['experience_years'] ?? '10+',
            'experience_label' => $tenant->data['experience_label'] ?? "Années d'expérience",
            
            // New Customization Fields
            'hero_slide2_title' => $tenant->data['hero_slide2_title'] ?? 'Boostez Votre Carrière',
            'hero_slide2_subtitle' => $tenant->data['hero_slide2_subtitle'] ?? 'Accédez à plus de formations spécialisées conçues par des experts du secteur.',
            'hero_slide3_title' => $tenant->data['hero_slide3_title'] ?? 'Validé & Certifié',
            'hero_slide3_subtitle' => $tenant->data['hero_slide3_subtitle'] ?? "Tous nos diplômes sont reconnus et valorisés par les entreprises partenaires de l'académie.",
            
            'feature1_title' => $tenant->data['feature1_title'] ?? 'Pédagogie Active',
            'feature1_desc' => $tenant->data['feature1_desc'] ?? 'Des contenus interactifs conçus pour une mémorisation rapide et efficace.',
            'feature2_title' => $tenant->data['feature2_title'] ?? 'Flexibilité Totale',
            'feature2_desc' => $tenant->data['feature2_desc'] ?? 'Apprenez à votre rythme, sans pression, avec un accès illimité 24h/24.',
            'feature3_title' => $tenant->data['feature3_title'] ?? 'Certificats',
            'feature3_desc' => $tenant->data['feature3_desc'] ?? 'Chaque formation terminée vous donne droit à une certification officielle.',
            
            'stat_satisfaction_percent' => $tenant->data['stat_satisfaction_percent'] ?? '99',
        ]);
    }

    /**
     * Update the academy settings.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $tenant = $user->ownedTenants()->first();

        if (!$tenant) {
            Log::error('AcademySettings: Tenant not found for user ' . $user->id);
            return response()->json(['error' => 'Academy not found'], 404);
        }

        Log::info('AcademySettings: Updating for tenant ' . $tenant->id, $request->all());

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'about' => ['nullable', 'string'],
            'support_email' => ['nullable', 'email', 'max:255'],
            'support_phone' => ['nullable', 'string', 'max:50'],
            'facebook_url' => ['nullable', 'string', 'max:255'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'string', 'max:255'],
            'twitter_url' => ['nullable', 'string', 'max:255'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'favicon' => ['nullable', 'image', 'max:1024'],
            'banner' => ['nullable', 'image', 'max:4096'],
            'about_image' => ['nullable', 'image', 'max:4096'],
        ]);

        $tenant->name = $validated['name'];
        // Note: We are NOT updating slug here to avoid breaking existing links. 
        
        $data = $tenant->data ?? [];
        $data['description'] = $validated['description'] ?? '';
        $data['about'] = $validated['about'] ?? '';
        $data['footer_about'] = $request->input('footer_about') ?? '';
        $data['support_email'] = $validated['support_email'] ?? '';
        $data['support_phone'] = $validated['support_phone'] ?? '';
        $data['facebook_url'] = $validated['facebook_url'] ?? '';
        $data['instagram_url'] = $validated['instagram_url'] ?? '';
        $data['linkedin_url'] = $validated['linkedin_url'] ?? '';
        $data['twitter_url'] = $validated['twitter_url'] ?? '';
        $data['youtube_url'] = $validated['youtube_url'] ?? '';
        $data['experience_years'] = $request->input('experience_years') ?? '10+';
        $data['experience_label'] = $request->input('experience_label') ?? "Années d'expérience";

        // Hero Slides
        $data['hero_slide2_title'] = $request->input('hero_slide2_title') ?? 'Boostez Votre Carrière';
        $data['hero_slide2_subtitle'] = $request->input('hero_slide2_subtitle') ?? '';
        $data['hero_slide3_title'] = $request->input('hero_slide3_title') ?? 'Validé & Certifié';
        $data['hero_slide3_subtitle'] = $request->input('hero_slide3_subtitle') ?? '';

        // Features
        $data['feature1_title'] = $request->input('feature1_title') ?? 'Pédagogie Active';
        $data['feature1_desc'] = $request->input('feature1_desc') ?? '';
        $data['feature2_title'] = $request->input('feature2_title') ?? 'Flexibilité Totale';
        $data['feature2_desc'] = $request->input('feature2_desc') ?? '';
        $data['feature3_title'] = $request->input('feature3_title') ?? 'Certificats';
        $data['feature3_desc'] = $request->input('feature3_desc') ?? '';

        // Stats
        $data['stat_satisfaction_percent'] = $request->input('stat_satisfaction_percent') ?? '99';

        // Handle Image Uploads
        if ($request->hasFile('logo')) {
            Log::info('AcademySettings: Logo file received.');
            try {
                if (env('CLOUDINARY_URL')) {
                    try {
                        // Manual initialization to bypass config issues
                        $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));
                        $result = $cloudinary->uploadApi()->upload($request->file('logo')->getRealPath(), [
                            'folder' => 'academies/' . $tenant->id . '/logo'
                        ]);
                        $path = $result['secure_url'];
                        Log::info('AcademySettings: Logo uploaded to Cloudinary: ' . $path);
                    } catch (\Exception $e) {
                        Log::error('AcademySettings: Cloudinary failed, falling back to local. Error: ' . $e->getMessage());
                        $path = '/storage/' . $request->file('logo')->store('academies/logos', 'public');
                        Log::info('AcademySettings: Logo uploaded locally (fallback): ' . $path);
                    }
                } else {
                    $path = '/storage/' . $request->file('logo')->store('academies/logos', 'public');
                    Log::info('AcademySettings: Logo uploaded locally: ' . $path);
                }
                $data['logo_url'] = $path;
            } catch (\Exception $e) {
                Log::error('AcademySettings: Logo upload FATAL Error: ' . $e->getMessage());
            }
        }

        if ($request->hasFile('favicon')) {
            Log::info('AcademySettings: Favicon file received.');
            try {
                if (env('CLOUDINARY_URL')) {
                    try {
                        $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));
                        $result = $cloudinary->uploadApi()->upload($request->file('favicon')->getRealPath(), [
                            'folder' => 'academies/' . $tenant->id . '/favicon'
                        ]);
                        $path = $result['secure_url'];
                    } catch (\Exception $e) {
                        $path = '/storage/' . $request->file('favicon')->store('academies/favicons', 'public');
                    }
                } else {
                    $path = '/storage/' . $request->file('favicon')->store('academies/favicons', 'public');
                }
                $data['favicon_url'] = $path;
            } catch (\Exception $e) {
                Log::error('AcademySettings: Favicon upload FATAL Error: ' . $e->getMessage());
            }
        }

        if ($request->hasFile('banner')) {
            Log::info('AcademySettings: Banner file received.');
            try {
                if (env('CLOUDINARY_URL')) {
                    try {
                        $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));
                        $result = $cloudinary->uploadApi()->upload($request->file('banner')->getRealPath(), [
                            'folder' => 'academies/' . $tenant->id . '/banner'
                        ]);
                        $path = $result['secure_url'];
                    } catch (\Exception $e) {
                        $path = '/storage/' . $request->file('banner')->store('academies/banners', 'public');
                    }
                } else {
                    $path = '/storage/' . $request->file('banner')->store('academies/banners', 'public');
                }
                $data['banner_url'] = $path;
            } catch (\Exception $e) {
                 Log::error('AcademySettings: Banner upload FATAL Error: ' . $e->getMessage());
            }
        }

        if ($request->hasFile('about_image')) {
            Log::info('AcademySettings: About image file received.');
            try {
                if (env('CLOUDINARY_URL')) {
                    try {
                        $cloudinary = new \Cloudinary\Cloudinary(env('CLOUDINARY_URL'));
                        $result = $cloudinary->uploadApi()->upload($request->file('about_image')->getRealPath(), [
                            'folder' => 'academies/' . $tenant->id . '/about'
                        ]);
                        $path = $result['secure_url'];
                    } catch (\Exception $e) {
                        $path = '/storage/' . $request->file('about_image')->store('academies/abouts', 'public');
                    }
                } else {
                    $path = '/storage/' . $request->file('about_image')->store('academies/abouts', 'public');
                }
                $data['about_image'] = $path;
            } catch (\Exception $e) {
                 Log::error('AcademySettings: About image upload FATAL Error: ' . $e->getMessage());
            }
        }

        $tenant->data = $data;
        $tenant->save();

        Log::info('AcademySettings: Settings saved successfully.');

        return response()->json([
            'message' => 'Paramètres mis à jour avec succès.',
            'academy' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'description' => $data['description'] ?? '',
                'about' => $data['about'] ?? '',
                'footer_about' => $data['footer_about'] ?? '',
                'logo_url' => $data['logo_url'] ?? null,
                'banner_url' => $data['banner_url'] ?? null,
                'favicon_url' => $data['favicon_url'] ?? null,
                'about_image' => $data['about_image'] ?? null,
                'experience_years' => $data['experience_years'] ?? '10+',
                'experience_label' => $data['experience_label'] ?? "Années d'expérience",
                'support_email' => $data['support_email'] ?? '',
                'support_phone' => $data['support_phone'] ?? '',
                'facebook_url' => $data['facebook_url'] ?? '',
                'instagram_url' => $data['instagram_url'] ?? '',
                'linkedin_url' => $data['linkedin_url'] ?? '',
                'twitter_url' => $data['twitter_url'] ?? '',
                'youtube_url' => $data['youtube_url'] ?? '',
            ]
        ]);
    }
}
