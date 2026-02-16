<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    /**
     * Afficher le certificat (page imprimable / téléchargeable en PDF).
     */
    public function show(string $uuid)
    {
        $certificate = Certificate::with(['enrollment.user', 'enrollment.course.tenant'])
            ->where('certificate_uuid', $uuid)
            ->firstOrFail();

        $user = Auth::user();
        if (!$user || $certificate->enrollment->user_id !== $user->id) {
            abort(403, 'Accès non autorisé.');
        }

        return view('academy.certificate', [
            'certificate' => $certificate,
            'user' => $certificate->enrollment->user,
            'course' => $certificate->enrollment->course,
        ]);
    }
}
