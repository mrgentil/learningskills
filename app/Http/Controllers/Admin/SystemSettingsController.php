<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SystemSettingsController extends Controller
{
    /**
     * Get all platform settings.
     */
    public function index()
    {
        // Only super admin should access this
        if (!auth()->user()->is_super_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return SystemSetting::all()->groupBy('group');
    }

    /**
     * Bulk update settings.
     */
    public function update(Request $request)
    {
        if (!auth()->user()->is_super_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $settings = $request->input('settings', []);

        foreach ($settings as $key => $data) {
            SystemSetting::setSetting(
                $key, 
                $data['value'], 
                $data['type'] ?? 'string', 
                $data['group'] ?? 'general'
            );
        }

        return response()->json(['message' => 'Configuration mise à jour avec succès']);
    }

    /**
     * Setup default settings if empty.
     */
    public function setupDefaults()
    {
        if (!auth()->user()->is_super_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (SystemSetting::count() > 0) return;

        SystemSetting::setSetting('site_name', 'LearningSkills', 'string', 'general');
        SystemSetting::setSetting('support_email', 'support@learningskills.com', 'string', 'general');
        SystemSetting::setSetting('maintenance_mode', false, 'boolean', 'general');
        SystemSetting::setSetting('allow_registration', true, 'boolean', 'general');
        
        SystemSetting::setSetting('primary_color', '#0f172a', 'string', 'branding');
        SystemSetting::setSetting('accent_color', '#f59e0b', 'string', 'branding');
        
        SystemSetting::setSetting('stripe_enabled', true, 'boolean', 'payments');
        SystemSetting::setSetting('tax_rate', 0, 'integer', 'payments');
    }
}
