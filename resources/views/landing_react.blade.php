<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearningSkills - Votre Académie Digitale</title>
    <meta name="description" content="Plateforme LMS SaaS professionnelle pour créer et vendre vos formations.">

    <!-- Stripe (needed for checkout redirect if any) -->
    <script src="https://js.stripe.com/v3/"></script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/landing.tsx'])
</head>

<body class="bg-background text-foreground">
    <div id="landing-app">
        <div
            style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
            <div style="text-align: center;">
                <h1 style="color: #1a1a1a;">LearningSkills</h1>
                <p style="color: #666;">Chargement de l'académie...</p>
                <noscript>JavaScript est requis pour voir cette page.</noscript>
            </div>
        </div>
    </div>

    <script>
        window.APP_DATA = {
            user: @json(Auth::user()),
            plans: @json($plans)
        };
    </script>
</body>

</html>
