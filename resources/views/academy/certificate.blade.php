<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Certificat - {{ $course->title }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Source Sans 3', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9; padding: 20px; }
        .cert-container { background: #fff; max-width: 800px; width: 100%; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .cert-border { border: 3px solid #f59e0b; margin: 24px; padding: 48px; min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .cert-logo { font-size: 14px; color: #64748b; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 4px; }
        .cert-title { font-family: 'Playfair Display', serif; font-size: 32px; color: #0f172a; margin-bottom: 16px; }
        .cert-subtitle { font-size: 18px; color: #64748b; margin-bottom: 40px; font-weight: 600; }
        .cert-name { font-size: 28px; color: #0f172a; font-weight: 700; margin-bottom: 12px; }
        .cert-course { font-size: 20px; color: #475569; margin-bottom: 32px; }
        .cert-date { font-size: 14px; color: #94a3b8; margin-bottom: 40px; }
        .cert-uuid { font-size: 11px; color: #cbd5e1; font-family: monospace; }
        .cert-actions { margin-top: 32px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-cert { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; font-size: 15px; transition: 0.2s; }
        .btn-print { background: #f59e0b; color: #fff; }
        .btn-print:hover { background: #d97706; }
        .btn-back { background: #e2e8f0; color: #475569; }
        .btn-back:hover { background: #cbd5e1; }
        @media print {
            body { background: #fff; padding: 0; }
            .cert-container { box-shadow: none; }
            .cert-actions { display: none; }
            .cert-border { border-color: #d97706; margin: 16px; padding: 32px; }
        }
    </style>
</head>
<body>
    <div class="cert-container">
        <div class="cert-border">
            <div class="cert-logo">{{ $certificate->enrollment->course->tenant->name ?? config('app.name') }}</div>
            <h1 class="cert-title">Certificat de réussite</h1>
            <p class="cert-subtitle">Ce certificat atteste que</p>
            <p class="cert-name">{{ $user->name }}</p>
            <p class="cert-course">a terminé avec succès la formation<br><strong>{{ $course->title }}</strong></p>
            <p class="cert-date">Délivré le {{ $certificate->issued_at?->format('d/m/Y') ?? now()->format('d/m/Y') }}</p>
            <p class="cert-uuid">N° {{ $certificate->certificate_uuid }}</p>
            <div class="cert-actions">
                <button type="button" class="btn-cert btn-print" onclick="window.print()">
                    <i class="fa fa-print"></i> Imprimer / Enregistrer en PDF
                </button>
                <a href="{{ route('dashboard.my-courses') }}" class="btn-cert btn-back">
                    <i class="fa fa-arrow-left"></i> Retour au dashboard
                </a>
            </div>
        </div>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</body>
</html>
