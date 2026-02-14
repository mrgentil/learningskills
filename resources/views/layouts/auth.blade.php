<!DOCTYPE html>
<html class="no-js" lang="fr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Auth</title>

    <!-- icons & favicons -->
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('landing/img/favicon/favicon.ico') }}" />
    <link rel="icon" type="image/x-icon" href="{{ asset('landing/img/favicon/favicon.ico') }}" />

    <!-- BOOTSTRAP CSS -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/bootstrap/css/bootstrap.min.css') }}" />
    <!-- FONT AWESOME CSS -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/fontawesome/css/font-awesome.min.css') }}" />
    <!-- GOOGLE FONT -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300,800%7CExo:300,400,500,600,700,900"
        rel="stylesheet" />

    <!-- CUSTOM  CSS  -->
    <link id="cbx-style" data-layout="1" rel="stylesheet" href="{{ asset('landing/css/style1-default.min.css') }}"
        media="all" />

    <style>
        :root {
            --primary: {{ isset($tenant) ? '#f59e0b' : '#ff007a' }};
            --primary-hover: {{ isset($tenant) ? '#d97706' : '#e6006e' }};
            --navy: #0f172a;
        }

        body {
            font-family: 'Roboto', 'Open Sans', sans-serif;
            background-color: #f8fafc;
        }

        .auth-card {
            background: #fff;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
            margin-bottom: 50px;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .cbx-form .form-control {
            border-radius: 10px;
            padding: 12px 15px;
            height: auto;
            border: 2px solid #e2e8f0;
            transition: 0.3s;
        }

        .cbx-form .form-control:focus {
            border-color: var(--primary);
            box-shadow: none;
        }

        .cbx-form button[type="submit"] {
            background: var(--primary);
            color: #fff;
            font-weight: 800;
            text-transform: uppercase;
            padding: 15px;
            border: none;
            border-radius: 10px;
            transition: all 0.3s;
            letter-spacing: 1px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .cbx-form button[type="submit"]:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .auth-header {
            padding: 120px 0 80px;
            background: {{ isset($tenant) ? 'var(--navy)' : 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)' }};
            color: #fff;
            text-align: center;
            margin-bottom: -60px;
            position: relative;
            z-index: 1;
        }

        .invalid-feedback {
            color: #ef4444;
            font-size: 13px;
            margin-top: 5px;
            display: block;
            font-weight: 600;
        }

        .form-control.is-invalid {
            border-color: #ef4444 !important;
        }

        .uppercase {
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 800;
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
            display: block;
        }
    </style>
</head>

<body>

    <div class="cbx-container">
        <!-- Navbar -->
        <nav id="cbx-header" class="navbar navbar-default cbx-header" style="position: absolute; width: 100%;">
            <div class="container">
                <div class="navbar-header" style="display: flex; align-items: center;">
                    @if (isset($tenant))
                        <a class="navbar-brand" href="{{ route('academy.show', $tenant->slug) }}"
                            style="font-weight: 800; font-size: 24px; color: #1e293b; display: flex; align-items: center; padding: 0;">
                            @if (isset($tenant->data['logo_url']))
                                <img src="{{ $tenant->data['logo_url'] }}" alt="{{ $tenant->name }}"
                                    style="height: 40px; margin-right: 10px; border-radius: 5px;">
                            @endif
                            <span
                                style="color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">{{ $tenant->name }}</span>
                        </a>
                    @else
                        <a class="navbar-brand cbx-logo" href="{{ url('/') }}">Landing<span>​‌Ž</span></a>
                    @endif
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li><a
                                href="{{ isset($tenant) ? route('academy.show', $tenant->slug) : url('/') }}"><span>{{ isset($tenant) ? 'Retour à l\'académie' : 'Retour à l\'accueil' }}</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="auth-header"
            style="{{ isset($tenant) && isset($tenant->data['banner_url']) ? 'background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(' . $tenant->data['banner_url'] . '); background-size: cover; background-position: center;' : 'background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);' }}">
            <div class="container">
                @if (isset($tenant) && isset($tenant->data['logo_url']) && !isset($tenant->data['banner_url']))
                    <img src="{{ $tenant->data['logo_url'] }}"
                        style="height: 80px; border-radius: 50%; border: 3px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2); margin-bottom: 20px;">
                @endif
                <h2 class="uppercase" style="color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">@yield('title')
                </h2>
                @if (isset($tenant))
                    <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">{{ $tenant->name }}</p>
                @endif
            </div>
        </div>

        <section class="cbx-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <div class="auth-card cbx-form">
                            @yield('content')
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <div id="cbx-footer" style="padding: 30px 0;">
                <div class="container text-center">
                    <p class="copyrightinformation">Copyright {{ date('Y') }} © <a
                            href="#">LearningSkills</a>. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    </div>

    <!-- SCRIPTS -->
    <script src="{{ asset('landing/vendor/jquery/jquery-3.2.1.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/bootstrap/js/bootstrap.min.js') }}"></script>

</body>

</html>
