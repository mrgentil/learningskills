@extends('layouts.academy')

@section('title', $page->title . ' - ' . $tenant->name)

@section('content')
    <!-- Page Header -->
    <header class="page-header"
        style="background: var(--secondary); color: white; padding: 80px 0; text-align: center; margin-bottom: 60px;">
        <div class="container">
            <h1 class="page-title" style="font-size: 48px; margin: 0; color: white;">{{ $page->title }}</h1>
        </div>
    </header>

    <!-- Main Content -->
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2 content-area"
                style="font-size: 18px; line-height: 1.8; color: #334155; min-height: 400px;">
                {!! $page->content !!}
            </div>
        </div>
    </div>
@endsection

@section('styles')
    <style>
        .content-area h2 {
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 28px;
        }

        .content-area p {
            margin-bottom: 20px;
        }

        .content-area ul {
            margin-bottom: 20px;
            padding-left: 20px;
        }

        .content-area li {
            margin-bottom: 10px;
        }
    </style>
@endsection
