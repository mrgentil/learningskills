<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Dashboard</title>

    <!-- fonts (same as landing) -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300,800%7CExo:300,400,500,600,700,900"
        rel="stylesheet" />

    <!-- icons (same as landing) -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/fontawesome/css/font-awesome.min.css') }}" />

    <!-- bootstrap (same as landing) -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/bootstrap/css/bootstrap.min.css') }}" />

    <!-- LearningSkills Core Style (for continuity) -->
    <link id="cbx-style" data-layout="1" rel="stylesheet" href="{{ asset('landing/css/style1-default.min.css') }}"
        media="all" />

    <!-- Scripts -->
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/js/app.jsx'])

    <style>
        /* Bridge styles for Dashboard Layout */
        body {
            background-color: #f8fafc;
            font-family: 'Open Sans', sans-serif;
            overflow-x: hidden;
        }
    </style>
</head>

<body>
    <div id="app"></div>
</body>

</html>
