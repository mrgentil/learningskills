<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', $tenant->name)</title>
    @if ($tenant->data['favicon_url'] ?? null)
        <link rel="icon" type="image/png" href="{{ $tenant->data['favicon_url'] }}">
    @endif
    @if (isset($page) && $page->meta_description)
        <meta name="description" content="{{ $page->meta_description }}">
    @endif

    <!-- Fonts: Roboto / Slab for Education vibe -->
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Roboto+Slab:wght@400;700&display=swap"
        rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

    <!-- Bootstrap -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/bootstrap/css/bootstrap.min.css') }}" />

    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <style>
        :root {
            --primary: #f59e0b;
            /* Amber/Yellow typical of education */
            --primary-dark: #d97706;
            --secondary: #1e293b;
            /* Dark Slate */
            --accent: #3b82f6;
            /* Blue */
            --text: #475569;
            --bg-light: #f1f5f9;
        }

        body {
            font-family: 'Roboto', sans-serif;
            color: var(--text);
            background-color: #fff;
            overflow-x: hidden;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: 'Roboto Slab', serif;
            color: var(--secondary);
            font-weight: 700;
        }

        /* Top Bar */
        .top-bar {
            background: #0f172a;
            /* Even darker for better contrast */
            color: #cbd5e1;
            padding: 8px 0;
            font-size: 13px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .top-bar i {
            margin-right: 5px;
            color: var(--primary);
            font-size: 14px;
        }

        .top-bar a.social-link {
            color: #cbd5e1;
            margin-left: 18px;
            font-size: 16px;
            transition: 0.3s;
            display: inline-block;
        }

        .top-bar a.social-link:hover {
            color: var(--primary);
            transform: translateY(-2px);
        }

        /* Navbar */
        .navbar-custom {
            background: #fff;
            border-bottom: none;
            padding: 20px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            margin-bottom: 0;
            position: relative;
            z-index: 1000;
        }

        .navbar-brand {
            font-size: 24px;
            color: var(--secondary) !important;
            font-weight: 900;
            text-transform: uppercase;
            display: flex;
            align-items: center;
        }

        .nav-link {
            font-weight: 700;
            color: var(--secondary) !important;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 0.5px;
            margin-left: 25px;
        }

        .btn-nav-cta {
            background: var(--primary);
            color: white !important;
            padding: 10px 25px;
            border-radius: 4px;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            transition: all 0.3s;
            text-decoration: none;
        }

        .btn-nav-cta:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }

        /* Footer */
        footer {
            background: #111827;
            color: #94a3b8;
            padding: 80px 0 0;
            margin-top: 60px;
        }

        .footer-widget h4 {
            color: white;
            text-transform: uppercase;
            font-size: 18px;
            margin-bottom: 30px;
            border-left: 3px solid var(--primary);
            padding-left: 15px;
        }

        .footer-links a {
            display: block;
            color: #94a3b8;
            padding: 8px 0;
            text-decoration: none;
            transition: 0.3s;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-links a:hover {
            color: var(--primary);
            padding-left: 10px;
        }

        .copyright {
            background: #0f172a;
            padding: 25px 0;
            margin-top: 60px;
            text-align: center;
            font-size: 14px;
        }
    </style>
    @yield('styles')
</head>

<body>

    <!-- Top Bar -->
    <div class="top-bar hidden-xs">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    @if (!empty($tenant->data['support_email']))
                        <i class="fa fa-envelope"></i> {{ $tenant->data['support_email'] }}
                    @endif
                    @if (!empty($tenant->data['support_phone']))
                        @if (!empty($tenant->data['support_email']))
                            <span style="margin: 0 10px; opacity: 0.3;">|</span>
                        @endif
                        <i class="fa fa-phone"></i> {{ $tenant->data['support_phone'] }}
                    @endif
                </div>
                <div class="col-md-6 text-right">
                    @if (!empty($tenant->data['facebook_url']))
                        <a href="{{ $tenant->data['facebook_url'] }}" target="_blank" class="social-link"><i
                                class="fab fa-facebook-f"></i></a>
                    @endif
                    @if (!empty($tenant->data['instagram_url']))
                        <a href="{{ $tenant->data['instagram_url'] }}" target="_blank" class="social-link"><i
                                class="fab fa-instagram"></i></a>
                    @endif
                    @if (!empty($tenant->data['twitter_url']))
                        <a href="{{ $tenant->data['twitter_url'] }}" target="_blank" class="social-link"><i
                                class="fab fa-twitter"></i></a>
                    @endif
                    @if (!empty($tenant->data['linkedin_url']))
                        <a href="{{ $tenant->data['linkedin_url'] }}" target="_blank" class="social-link"><i
                                class="fab fa-linkedin-in"></i></a>
                    @endif
                    @if (!empty($tenant->data['youtube_url']))
                        <a href="{{ $tenant->data['youtube_url'] }}" target="_blank" class="social-link"><i
                                class="fab fa-youtube"></i></a>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-default navbar-custom">
        <div class="container">
            <div class="navbar-header"
                style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <a class="navbar-brand" href="{{ route('academy.show', $tenant->slug) }}">
                    @if (isset($tenant->data['logo_url']))
                        <img src="{{ $tenant->data['logo_url'] }}" alt="{{ $tenant->name }}"
                            style="height: 50px; margin-right: 15px;">
                    @else
                        <i class="fa fa-book-reader" style="color: var(--primary); margin-right: 10px;"></i>
                    @endif
                    <span>{{ $tenant->name }}</span>
                </a>

                <div class="hidden-xs">
                    <ul class="nav navbar-nav navbar-right"
                        style="flex-direction: row; display: flex; align-items: center;">
                        <li><a href="{{ route('academy.show', $tenant->slug) }}" class="nav-link">Accueil</a></li>
                        <li><a href="{{ route('academy.show', $tenant->slug) }}#courses" class="nav-link">Cours</a>
                        </li>

                        @if (isset($pages))
                            @foreach ($pages->where('show_in_nav', true) as $navPage)
                                <li><a href="{{ route('page.show', [$tenant->slug, $navPage->slug]) }}"
                                        class="nav-link">{{ $navPage->title }}</a></li>
                            @endforeach
                        @endif

                        @auth
                            <li><a href="{{ url('/dashboard') }}" class="btn-nav-cta" style="margin-left: 20px;">Mon
                                    Compte</a></li>
                        @else
                            <li><a href="{{ route('login', ['academy' => $tenant->slug]) }}" class="nav-link"
                                    style="color: var(--primary) !important;">Connexion</a></li>
                            <li><a href="{{ route('register', ['academy' => $tenant->slug]) }}" class="btn-nav-cta"
                                    style="margin-left: 20px;">S'inscrire</a></li>
                        @endauth
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    @yield('content')

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-4 footer-widget">
                    <h4>{{ $tenant->name }}</h4>
                    <p>
                        {{ $tenant->data['footer_about'] ?? "Notre mission est de rendre l'éducation accessible à tous. Rejoignez notre communauté d'apprenants et changez votre avenir." }}
                    </p>
                    <div class="footer-social" style="margin-top: 25px;">
                        @if (!empty($tenant->data['facebook_url']))
                            <a href="{{ $tenant->data['facebook_url'] }}" target="_blank"
                                style="color: white; background: rgba(255,255,255,0.1); width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 10px; transition: 0.3s;"><i
                                    class="fab fa-facebook-f"></i></a>
                        @endif
                        @if (!empty($tenant->data['instagram_url']))
                            <a href="{{ $tenant->data['instagram_url'] }}" target="_blank"
                                style="color: white; background: rgba(255,255,255,0.1); width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 10px; transition: 0.3s;"><i
                                    class="fab fa-instagram"></i></a>
                        @endif
                        @if (!empty($tenant->data['twitter_url']))
                            <a href="{{ $tenant->data['twitter_url'] }}" target="_blank"
                                style="color: white; background: rgba(255,255,255,0.1); width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 10px; transition: 0.3s;"><i
                                    class="fab fa-twitter"></i></a>
                        @endif
                        @if (!empty($tenant->data['linkedin_url']))
                            <a href="{{ $tenant->data['linkedin_url'] }}" target="_blank"
                                style="color: white; background: rgba(255,255,255,0.1); width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 10px; transition: 0.3s;"><i
                                    class="fab fa-linkedin-in"></i></a>
                        @endif
                        @if (!empty($tenant->data['youtube_url']))
                            <a href="{{ $tenant->data['youtube_url'] }}" target="_blank"
                                style="color: white; background: rgba(255,255,255,0.1); width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; transition: 0.3s;"><i
                                    class="fab fa-youtube"></i></a>
                        @endif
                    </div>
                </div>
                <div class="col-md-2 col-md-offset-1 footer-widget">
                    <h4>Liens Utiles</h4>
                    <div class="footer-links">
                        <a href="{{ route('academy.show', $tenant->slug) }}">Accueil</a>
                        <a href="{{ route('academy.show', $tenant->slug) }}#courses">Tous les cours</a>
                        @if (isset($pages))
                            @foreach ($pages->where('show_in_nav', true) as $navPage)
                                <a
                                    href="{{ route('page.show', [$tenant->slug, $navPage->slug]) }}">{{ $navPage->title }}</a>
                            @endforeach
                        @endif
                    </div>
                </div>
                <div class="col-md-2 footer-widget">
                    <h4>Support & Légal</h4>
                    <div class="footer-links">
                        @if (isset($pages))
                            @foreach ($pages->where('show_in_nav', false) as $footerPage)
                                <a
                                    href="{{ route('page.show', [$tenant->slug, $footerPage->slug]) }}">{{ $footerPage->title }}</a>
                            @endforeach
                        @endif
                        @if (!isset($pages) || $pages->where('show_in_nav', false)->isEmpty())
                            <a href="#">FAQ</a>
                            <a href="#">Conditions</a>
                        @endif
                    </div>
                </div>
                <div class="col-md-3 footer-widget">
                    <h4>Contact</h4>
                    <div class="footer-links">
                        @if (isset($tenant->data['support_email']))
                            <a href="mailto:{{ $tenant->data['support_email'] }}"><i class="fa fa-envelope"></i>
                                {{ $tenant->data['support_email'] }}</a>
                        @endif
                        @if (isset($tenant->data['support_phone']))
                            <a href="tel:{{ $tenant->data['support_phone'] }}"><i class="fa fa-phone"></i>
                                {{ $tenant->data['support_phone'] }}</a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            <div class="container">
                &copy; {{ date('Y') }} {{ $tenant->name }}. All Rights Reserved. Powered by LearningSkills.
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script src="{{ asset('landing/vendor/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/bootstrap/js/bootstrap.min.js') }}"></script>
    @yield('scripts')
</body>

</html>
