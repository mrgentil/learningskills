@extends('layouts.academy')

@section('title', $course->title . ' - ' . $tenant->name)

@section('content')
    <!-- Ultra-Clean Premium Hero -->
    <header class="course-hero-stunning">
        <div class="absolute-fill stunning-gradient-bg"></div>
        <div class="container relative-z">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <!-- Modern Breadcrumbs -->
                    <nav class="course-breadcrumb-premium mb-4 anim-fade-up">
                        <a href="{{ route('academy.show', $tenant->slug) }}">Accueil</a>
                        <i class="fa fa-chevron-right px-2"></i>
                        <a href="{{ route('academy.courses', $tenant->slug) }}">Nos Cours</a>
                        <i class="fa fa-chevron-right px-2"></i>
                        <span class="active">{{ $course->title }}</span>
                    </nav>

                    <div class="course-badges-row mb-4 anim-fade-up">
                        <span class="badge-pill-gold">{{ $course->category->name ?? 'Formation Pro' }}</span>
                        <span class="badge-pill-white ml-2">{{ $course->level ?? 'Tous Niveaux' }}</span>
                    </div>

                    <h1 class="course-title-main anim-fade-up">
                        {{ $course->title }}
                    </h1>

                    <p class="course-excerpt-main anim-fade-up">
                        {{ $course->short_description }}
                    </p>

                    <div class="course-meta-icons-row anim-fade-up">
                        <div class="meta-item-stunning">
                            <div class="m-icon-box"><i class="fa fa-user-circle"></i></div>
                            <div class="m-text-box">
                                <small>Expert</small>
                                <strong>{{ $tenant->owner->name }}</strong>
                            </div>
                        </div>
                        <div class="meta-item-stunning">
                            <div class="m-icon-box"><i class="fa fa-users-viewfinder"></i></div>
                            <div class="m-text-box">
                                <small>Apprenants</small>
                                <strong>{{ $course->total_enrollments ?? 0 }} Inscrits</strong>
                            </div>
                        </div>
                        <div class="meta-item-stunning">
                            <div class="m-icon-box"><i class="fa fa-certificate"></i></div>
                            <div class="m-text-box">
                                <small>Certification</small>
                                <strong>Inclus</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="container course-body-stunning">
        <div class="row">
            <div class="col-lg-8">
                <!-- Learning Objectives Card -->
                <div class="stunning-card-white mb-5 anim-fade-up">
                    <h3 class="card-title-border">Pourquoi choisir cette formation ?</h3>
                    <div class="row mt-4">
                        <div class="col-md-6 mb-3">
                            <div class="benefit-item">
                                <i class="fa fa-rocket text-gold"></i>
                                <span>Boostez votre carrière rapidement</span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="benefit-item">
                                <i class="fa fa-laptop-code text-gold"></i>
                                <span>Projets pratiques et concrets</span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="benefit-item">
                                <i class="fa fa-headset text-gold"></i>
                                <span>Support dédié de nos experts</span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="benefit-item">
                                <i class="fa fa-award text-gold"></i>
                                <span>Certification reconnue incluse</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description Card -->
                <div class="stunning-card-white mb-5 anim-fade-up">
                    <h3 class="card-title-border">Description détaillée</h3>
                    <div class="rich-text-content-wrapper mt-4">
                        {!! $course->description !!}
                    </div>
                </div>

                <!-- Curriculum Card -->
                @if ($course->modules->count() > 0)
                    <div class="stunning-card-white mb-5 anim-fade-up">
                        <h3 class="card-title-border mb-4">Programme de la formation</h3>
                        <div class="stunning-curriculum-list">
                            @foreach ($course->modules as $index => $module)
                                <div class="module-block mb-3">
                                    <div class="module-header-stunning">
                                        <div class="m-h-info">
                                            <span class="m-number">{{ $index + 1 }}</span>
                                            <div class="m-titles">
                                                <h4>{{ $module->title }}</h4>
                                                <span>{{ $module->lessons->count() }} leçons interactives</span>
                                            </div>
                                        </div>
                                        <div class="m-h-icon">
                                            <i class="fa fa-plus-circle"></i>
                                        </div>
                                    </div>
                                    <div class="module-body-stunning">
                                        @foreach ($module->lessons as $lesson)
                                            <div class="lesson-row-stunning">
                                                <div class="l-left">
                                                    <i class="fa fa-play-circle m-icon-dim"></i>
                                                    <span>{{ $lesson->title }}</span>
                                                </div>
                                                <div class="l-right">
                                                    <span>{{ $lesson->duration ?? '10:00' }}</span>
                                                    <i class="fa fa-lock ml-3"></i>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>

            <div class="col-lg-4">
                <!-- High-Impact Sticky Sidebar -->
                <div class="sidebar-sticky-stunning">
                    <div class="s-preview-media">
                        <img src="{{ $course->thumbnail ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800' }}"
                            alt="{{ $course->title }}">
                        <div class="s-media-overlay">
                            <div class="s-pulse-play">
                                <i class="fa fa-play text-white"></i>
                            </div>
                            <span class="s-meta-preview">Aperçu vidéo du cours</span>
                        </div>
                    </div>

                    <div class="s-main-content">
                        <div class="s-pricing-box text-center">
                            @if ($course->is_free)
                                <h2 class="price-free">GRATUIT</h2>
                            @else
                                <div class="price-full">
                                    <span class="currency">$</span>
                                    <span class="value">{{ number_format($course->price, 0) }}</span>
                                </div>
                            @endif
                        </div>

                        <form action="{{ route('enroll', $course->id) }}" method="POST" class="mt-4">
                            @csrf
                            <button type="submit" class="s-btn-enroll-stunning w-100">
                                S'inscrire maintenant
                                <i class="fa fa-arrow-right ml-2"></i>
                            </button>
                        </form>

                        <div class="s-guarantee-text text-center mt-3">
                            <i class="fa fa-shield-check text-success"></i> Accès à vie garanti
                        </div>

                        <div class="s-features-check-list mt-5">
                            <h5 class="s-list-title mb-4">Ce qui est inclus :</h5>
                            <div class="s-item-check"><i class="fa fa-infinity"></i> Accès illimité à vie</div>
                            <div class="s-item-check"><i class="fa fa-certificate"></i> Certificat de réussite</div>
                            <div class="s-item-check"><i class="fa fa-mobile-screen"></i> Accès multi-dispositifs</div>
                            <div class="s-item-check"><i class="fa fa-message-captions"></i> Support de l'instructeur</div>
                        </div>

                        <div class="s-share-section mt-5 border-top pt-4 text-center">
                            <p class="small text-uppercase font-weight-bold letter-spacing-1 mb-3">Partager ce cours</p>
                            <div class="d-flex justify-content-center gap-3" style="gap: 15px;">
                                <a href="#" class="s-social-circle"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="s-social-circle"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="s-social-circle"><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('styles')
    <style>
        /* Premium Design System */
        .course-hero-stunning {
            background-color: #0f172a;
            padding: 130px 0 180px;
            color: #ffffff;
            position: relative;
            overflow: hidden;
        }

        .stunning-gradient-bg {
            background: radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 40%);
            pointer-events: none;
        }

        .absolute-fill {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .relative-z {
            position: relative;
            z-index: 10;
        }

        .course-breadcrumb-premium {
            font-size: 13px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.5);
            display: flex;
            align-items: center;
        }

        .course-breadcrumb-premium a {
            color: inherit;
            text-decoration: none;
            transition: 0.3s;
        }

        .course-breadcrumb-premium a:hover {
            color: #f59e0b;
        }

        .course-breadcrumb-premium .active {
            color: #f59e0b;
        }

        .badge-pill-gold {
            background: #f59e0b;
            color: #ffffff !important;
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .badge-pill-white {
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.8) !important;
            padding: 5px 14px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .course-title-main {
            font-size: 64px;
            font-weight: 900;
            line-height: 1.1;
            margin: 25px 0;
            letter-spacing: -2px;
            color: #ffffff !important;
            text-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        }

        .course-excerpt-main {
            font-size: 22px;
            color: rgba(255, 255, 255, 0.8) !important;
            line-height: 1.7;
            max-width: 750px;
            margin-bottom: 50px;
        }

        .course-meta-icons-row {
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
        }

        .meta-item-stunning {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .m-icon-box {
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            font-size: 20px;
        }

        .m-text-box small {
            display: block;
            color: rgba(255, 255, 255, 0.5);
            font-weight: 700;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
        }

        .m-text-box strong {
            font-size: 16px;
            color: #ffffff;
        }

        /* Content Area */
        .course-body-stunning {
            margin-top: -120px;
            padding-bottom: 120px;
            position: relative;
            z-index: 20;
        }

        .stunning-card-white {
            background: #ffffff;
            border-radius: 35px;
            padding: 60px;
            box-shadow: 0 40px 100px rgba(15, 23, 42, 0.08);
            border: 1px solid #f1f5f9;
        }

        .card-title-border {
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
            position: relative;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .card-title-border:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 70px;
            height: 6px;
            background: #f59e0b;
            border-radius: 10px;
        }

        .benefit-item {
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 700;
            color: #334155;
            font-size: 16px;
        }

        .benefit-item i {
            font-size: 24px;
            color: #f59e0b;
        }

        .rich-text-content-wrapper {
            font-size: 19px;
            line-height: 2;
            color: #475569;
        }

        /* Accordion Redesign */
        .module-block {
            border: 1px solid #f1f5f9;
            border-radius: 20px;
            overflow: hidden;
        }

        .module-header-stunning {
            padding: 25px 35px;
            background: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: 0.3s;
        }

        .module-header-stunning:hover {
            background: #f8fafc;
        }

        .m-h-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .m-number {
            width: 40px;
            height: 40px;
            background: #0f172a;
            color: #ffffff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
        }

        .m-titles h4 {
            margin: 0;
            font-size: 19px;
            font-weight: 900;
            color: #0f172a;
        }

        .m-titles span {
            font-size: 13px;
            color: #64748b;
            font-weight: 700;
        }

        .m-h-icon {
            color: #f59e0b;
            font-size: 18px;
        }

        .lesson-row-stunning {
            padding: 15px 35px 15px 85px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 700;
            color: #475569;
            border-top: 1px solid #f8fafc;
            transition: 0.2s;
        }

        .lesson-row-stunning:hover {
            color: #f59e0b;
            background: #fafafa;
        }

        .m-icon-dim {
            color: #cbd5e1;
            margin-right: 15px;
            font-size: 20px;
        }

        /* Sticky Sidebar PREMIUM */
        .sidebar-sticky-stunning {
            position: sticky;
            top: 30px;
            background: #ffffff;
            border-radius: 40px;
            overflow: hidden;
            box-shadow: 0 50px 120px rgba(15, 23, 42, 0.12);
            border: 1px solid #f1f5f9;
            z-index: 100;
        }

        .s-preview-media {
            position: relative;
            height: 260px;
            overflow: hidden;
        }

        .s-preview-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.5s;
        }

        .s-preview-media:hover img {
            transform: scale(1.1);
        }

        .s-media-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.4);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }

        .s-pulse-play {
            width: 80px;
            height: 80px;
            background: #f59e0b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
            animation: playPulse 2s infinite;
        }

        @keyframes playPulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
            }

            70% {
                transform: scale(1.1);
                box-shadow: 0 0 0 20px rgba(245, 158, 11, 0);
            }

            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
            }
        }

        .s-meta-preview {
            color: #ffffff;
            font-weight: 900;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .s-main-content {
            padding: 45px;
        }

        .price-free {
            font-size: 48px;
            font-weight: 950;
            color: #0f172a;
            margin: 0;
            letter-spacing: -1px;
        }

        .price-full {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 5px;
            color: #0f172a;
        }

        .price-full .currency {
            font-size: 28px;
            font-weight: 800;
            margin-top: 10px;
        }

        .price-full .value {
            font-size: 64px;
            font-weight: 950;
            letter-spacing: -2px;
        }

        .s-btn-enroll-stunning {
            background: #f59e0b;
            color: #ffffff !important;
            border: none;
            padding: 24px;
            border-radius: 24px;
            font-weight: 950;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 20px 40px rgba(245, 158, 11, 0.4);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .s-btn-enroll-stunning:hover {
            transform: translateY(-8px);
            background: #d97706;
            box-shadow: 0 30px 60px rgba(245, 158, 11, 0.5);
        }

        .s-guarantee-text {
            font-size: 14px;
            font-weight: 800;
            color: #64748b;
        }

        .s-list-title {
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .s-item-check {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 15px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 12px;
        }

        .s-item-check i {
            color: #f59e0b;
            font-size: 18px;
        }

        .s-social-circle {
            width: 50px;
            height: 50px;
            background: #f1f5f9;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            font-size: 18px;
            transition: 0.3s;
            text-decoration: none !important;
        }

        .s-social-circle:hover {
            background: #f59e0b;
            color: #ffffff;
            transform: translateY(-3px);
        }

        /* Performance Animations */
        .anim-fade-up {
            animation: fadeUpStunning 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
        }

        @keyframes fadeUpStunning {
            from {
                opacity: 0;
                transform: translateY(50px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
@endsection
