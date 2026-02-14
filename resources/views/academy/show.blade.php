@extends('layouts.academy')

@section('title', $tenant->name . ' - Excellence Éducative')

@section('content')
    <!-- Hero Section -->
    <!-- Hero Slider Section -->
    <header class="hero-slider-wrapper">
        <div class="swiper hero-swiper">
            <div class="swiper-wrapper">
                <!-- Slide 1: Welcome -->
                <div class="swiper-slide hero-premium"
                    style="background-image: linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('{{ $tenant->data['banner_url'] ?? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop' }}');">
                    <div class="container hero-content">
                        <div class="row">
                            <div class="col-lg-8 text-center text-lg-left">
                                <div class="hero-text-box anim-fade-up">
                                    <span class="badge-premium mb-3">✨ Plateforme d'excellence</span>
                                    <h1 class="hero-title-premium">{{ $tenant->name }}</h1>
                                    <p class="hero-subtitle-premium">
                                        {{ $tenant->data['description'] ?? 'Développez vos compétences avec des formations de haut niveau. Un accompagnement personnalisé pour votre réussite professionnelle.' }}
                                    </p>
                                    <div class="hero-btns mt-4">
                                        <a href="#courses" class="btn-premium">Démarrer maintenant</a>
                                        <a href="#about"
                                            class="btn-premium btn-white-outline ml-lg-3 mt-3 mt-lg-0">Découvrir
                                            l'académie</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 2: Featured Courses -->
                <div class="swiper-slide hero-premium"
                    style="background-image: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop');">
                    <div class="container hero-content">
                        <div class="row">
                            <div class="col-lg-8 text-center text-lg-left">
                                <div class="hero-text-box anim-fade-up">
                                    <span class="badge-premium mb-3">🔥 Formations Vedettes</span>
                                    <h2 class="hero-title-premium" style="font-size: 56px;">
                                        {{ $tenant->data['hero_slide2_title'] ?? 'Boostez Votre Carrière' }}</h2>
                                    <p class="hero-subtitle-premium">
                                        {{ $tenant->data['hero_slide2_subtitle'] ?? "Accédez à plus de $totalCoursesCount formations spécialisées conçues par des experts du secteur." }}
                                    </p>
                                    <div class="hero-btns mt-4">
                                        <a href="{{ route('academy.courses', $tenant->slug) }}" class="btn-premium">Voir le
                                            catalogue</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slide 3: Certification -->
                <div class="swiper-slide hero-premium"
                    style="background-image: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop');">
                    <div class="container hero-content">
                        <div class="row">
                            <div class="col-lg-8 text-center text-lg-left">
                                <div class="hero-text-box anim-fade-up">
                                    <span class="badge-premium mb-3">🎓 Certification Officielle</span>
                                    <h2 class="hero-title-premium" style="font-size: 56px;">
                                        {{ $tenant->data['hero_slide3_title'] ?? 'Validé & Certifié' }}</h2>
                                    <p class="hero-subtitle-premium">
                                        {{ $tenant->data['hero_slide3_subtitle'] ?? "Tous nos diplômes sont reconnus et valorisés par les entreprises partenaires de l'académie." }}
                                    </p>
                                    <div class="hero-btns mt-4">
                                        <a href="#contact" class="btn-premium btn-white-outline">Devenir Instructeur</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Slider Controls -->
            <div class="swiper-pagination hero-pagination"></div>
            <div class="swiper-button-next hero-nav"></div>
            <div class="swiper-button-prev hero-nav"></div>
        </div>

        <div class="hero-wave">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,10.18,17.17,46.12,38.19,82,59.21,148,80,188,80S302.21,60.1,321.39,56.44Z"
                    class="shape-fill"></path>
            </svg>
        </div>
    </header>

    <!-- Features Section -->
    <section class="features-section pb-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="feature-card-clean">
                        <div class="f-icon bg-gold"><i class="fa fa-graduation-cap"></i></div>
                        <h3>{{ $tenant->data['feature1_title'] ?? 'Pédagogie Active' }}</h3>
                        <p>{{ $tenant->data['feature1_desc'] ?? 'Des contenus interactifs conçus pour une mémorisation rapide et efficace.' }}
                        </p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="feature-card-clean">
                        <div class="f-icon bg-dark-blue"><i class="fa fa-clock"></i></div>
                        <h3>{{ $tenant->data['feature2_title'] ?? 'Flexibilité Totale' }}</h3>
                        <p>{{ $tenant->data['feature2_desc'] ?? 'Apprenez à votre rythme, sans pression, avec un accès illimité 24h/24.' }}
                        </p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="feature-card-clean">
                        <div class="f-icon bg-blue"><i class="fa fa-award"></i></div>
                        <h3>{{ $tenant->data['feature3_title'] ?? 'Certificats' }}</h3>
                        <p>{{ $tenant->data['feature3_desc'] ?? 'Chaque formation terminée vous donne droit à une certification officielle.' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-premium-strip" style="background: #0f172a; padding: 80px 0; color: white;">
        <div class="container">
            <div class="row">
                <div class="col-md-3 col-6 text-center stat-item">
                    <span class="s-number">1,200+</span>
                    <span class="s-label">Étudiants</span>
                </div>
                <div class="col-md-3 col-6 text-center stat-item">
                    <span class="s-number">{{ $totalCoursesCount }}+</span>
                    <span class="s-label">Formations</span>
                </div>
                <div class="col-md-3 col-6 text-center stat-item">
                    <span class="s-number">{{ $tenant->data['stat_satisfaction_percent'] ?? '99' }}%</span>
                    <span class="s-label">Satisfaction</span>
                </div>
                <div class="col-md-3 col-6 text-center stat-item">
                    <span class="s-number">100%</span>
                    <span class="s-label">En Ligne</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Popular Courses -->
    <section id="courses" class="courses-grid-section py-80">
        <div class="container">
            <div class="section-title-box">
                <span class="top-label">Catalogue</span>
                <h2>Nos Meilleures Formations</h2>
                <div class="title-line"></div>
            </div>

            <!-- Swiper Carousel -->
            <div class="swiper popular-courses-slider">
                <div class="swiper-wrapper">
                    @forelse($courses as $course)
                        <div class="swiper-slide pt-4 pb-5">
                            <div class="course-modern-card mx-2">
                                <div class="course-thumb">
                                    <img src="{{ $course->thumbnail ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800' }}"
                                        alt="{{ $course->title }}">
                                    <div class="price-badge">{{ $course->is_free ? 'GRATUIT' : $course->price . ' $' }}
                                    </div>
                                </div>
                                <div class="course-content">
                                    <h3 class="course-name">{{ $course->title }}</h3>
                                    <p class="course-excerpt">{{ Str::limit($course->short_description, 85) }}</p>
                                    <div class="course-footer">
                                        <span class="instructor"><i class="fa fa-user"></i>
                                            {{ $tenant->owner->name }}</span>
                                        <a href="{{ route('course.show', [$tenant->slug, $course->slug]) }}"
                                            class="btn-link-gold">Explorer <i class="fa fa-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="col-md-12 text-center py-5">
                            <div class="empty-state-clean">
                                <i class="fa fa-layer-group fa-3x mb-3 text-muted"></i>
                                <p class="text-muted">Bientôt de nouveaux cours disponibles !</p>
                            </div>
                        </div>
                    @endforelse
                </div>

                <!-- Navigation & Pagination -->
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next swiper-nav-custom"></div>
                <div class="swiper-button-prev swiper-nav-custom"></div>
            </div>

            @if ($courses->count() >= 3)
                <div class="text-center mt-5">
                    <a href="{{ route('academy.courses', $tenant->slug) }}" class="btn-premium btn-lg-premium">
                        Voir tous les cours <i class="fa fa-arrow-right ml-2"></i>
                    </a>
                </div>
            @endif
        </div>
    </section>

    <!-- About Section -->
    @if (!empty($tenant->data['about']))
        <section id="about" class="about-premium-section bg-gray">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0">
                        <div class="about-visual">
                            <img src="{{ $tenant->data['about_image'] ?? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000' }}"
                                class="img-main" alt="About">
                            <div class="experience-tag">
                                <span>{{ $tenant->data['experience_years'] ?? '10+' }}</span>
                                {{ $tenant->data['experience_label'] ?? "Années d'expérience" }}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 pl-lg-5">
                        <div class="about-text">
                            <span class="top-label text-gold">Notre Histoire</span>
                            <h2 class="section-heading mb-4">À Propos de {{ $tenant->name }}</h2>
                            <div class="about-rich-text">
                                {!! $tenant->data['about'] !!}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    @endif

    <!-- CTA Section -->
    <section class="cta-premium-banner">
        <div class="container">
            <div class="cta-inner text-center">
                <h2>Commencez à apprendre gratuitement dès aujourd'hui</h2>
                <p>Rejoignez une communauté de plus de 1,200 apprenants passionnés.</p>
                <a href="{{ route('register') }}" class="btn-cta-gold">Rejoindre l'académie</a>
            </div>
        </div>
    </section>
@endsection

@section('styles')
    <style>
        :root {
            --gold: #f59e0b;
            --gold-dark: #d97706;
            --dark-navy: #0f172a;
            --slate-600: #475569;
            --slate-100: #f1f5f9;
        }

        /* Hero Slider */
        .hero-slider-wrapper {
            position: relative;
            overflow: hidden;
            background: #0f172a;
        }

        .hero-swiper {
            height: 85vh;
            min-height: 700px;
        }

        .hero-premium {
            height: 100%;
            display: flex;
            align-items: center;
            background-size: cover;
            background-position: center;
            position: relative;
            color: white;
            padding: 120px 0;
        }

        .hero-nav {
            color: white;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            transition: 0.3s;
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10;
        }

        .hero-nav:hover {
            background: var(--gold);
            border-color: var(--gold);
            color: white;
            transform: scale(1.1);
        }

        .hero-nav:after {
            font-size: 20px;
            font-weight: 900;
        }

        .hero-pagination {
            bottom: 40px !important;
            z-index: 10;
        }

        .hero-pagination .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5);
            width: 12px;
            height: 12px;
            opacity: 1;
            margin: 0 8px !important;
            transition: 0.3s;
        }

        .hero-pagination .swiper-pagination-bullet-active {
            background: var(--gold);
            width: 40px;
            border-radius: 6px;
        }

        /* Animations */
        .anim-fade-up {
            opacity: 0;
            transform: translateY(40px);
            transition: all 1s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .swiper-slide-active .anim-fade-up {
            opacity: 1;
            transform: translateY(0);
            transition-delay: 0.4s;
        }

        .hero-title-premium {
            font-size: 72px;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 25px;
            letter-spacing: -2px;
            text-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
        }

        .hero-subtitle-premium {
            font-size: 22px;
            opacity: 1;
            margin-bottom: 45px;
            max-width: 650px;
            line-height: 1.6;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .badge-premium {
            background: rgba(245, 158, 11, 0.2);
            color: var(--gold);
            padding: 10px 24px;
            border-radius: 50px;
            font-weight: 800;
            border: 1px solid rgba(245, 158, 11, 0.3);
            display: inline-block;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }

        .btn-premium {
            background: #f59e0b;
            /* Force specific gold */
            color: #ffffff !important;
            padding: 18px 40px;
            border-radius: 12px;
            font-weight: 900;
            text-decoration: none;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: inline-block;
            box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
            border: 2px solid transparent;
            text-align: center;
        }

        .btn-premium:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(245, 158, 11, 0.4);
            text-decoration: none;
            color: #ffffff !important;
            background: #d97706;
        }

        .btn-white-outline {
            background: transparent;
            border: 2px solid white;
            color: white !important;
            box-shadow: none;
        }

        .btn-white-outline:hover {
            background: white;
            color: var(--dark-navy) !important;
        }

        .btn-lg-premium {
            padding: 22px 60px;
            font-size: 18px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .hero-wave {
            position: absolute;
            bottom: 0;
            width: 100%;
            line-height: 0;
        }

        .hero-wave svg {
            height: 80px;
            width: 100%;
        }

        .hero-wave .shape-fill {
            fill: #FFFFFF;
        }

        /* Features Overlap */
        .features-section {
            margin-top: -100px;
            position: relative;
            z-index: 100;
        }

        .feature-card-clean {
            background: white;
            padding: 50px 40px;
            border-radius: 30px;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
            text-align: center;
            height: 100%;
            transition: all 0.4s;
            border: 1px solid #f1f5f9;
        }

        .feature-card-clean:hover {
            transform: translateY(-15px);
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.12);
        }

        .f-icon {
            width: 80px;
            height: 80px;
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 35px;
            color: white;
        }

        .bg-gold {
            background: linear-gradient(135deg, var(--gold), var(--gold-dark));
        }

        .bg-dark-blue {
            background: linear-gradient(135deg, #1e293b, #0f172a);
        }

        .bg-blue {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .feature-card-clean h3 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 20px;
            color: #1e293b;
        }

        /* Stats Strip */
        .stats-premium-strip {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .s-number {
            display: block;
            font-size: 54px;
            font-weight: 900;
            color: var(--gold);
            line-height: 1;
            margin-bottom: 10px;
        }

        .s-label {
            font-size: 13px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.5);
        }

        .stat-item {
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-item:last-child {
            border-right: none;
        }

        /* Courses Section */
        .courses-grid-section {
            padding: 120px 0;
            background: white;
        }

        .section-title-box {
            text-align: center;
            margin-bottom: 80px;
        }

        .top-label {
            display: block;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--gold);
            letter-spacing: 4px;
            font-size: 13px;
            margin-bottom: 15px;
        }

        .section-title-box h2 {
            font-size: 48px;
            font-weight: 900;
            color: #1e293b;
            letter-spacing: -1px;
        }

        .title-line {
            width: 80px;
            height: 5px;
            background: var(--gold);
            margin: 30px auto 0;
            border-radius: 10px;
        }

        /* Swiper Custom Styles */
        .popular-courses-slider {
            padding: 20px 20px 60px;
            margin: 0 -20px;
        }

        .swiper-nav-custom {
            color: var(--gold);
            background: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            transition: 0.3s;
            top: 45%;
            z-index: 100 !important;
            cursor: pointer;
        }

        .swiper-nav-custom:after {
            font-size: 18px;
            font-weight: 900;
        }

        .swiper-nav-custom:hover {
            background: var(--gold);
            color: white;
            transform: scale(1.1);
        }

        .swiper-button-prev.swiper-nav-custom {
            left: 0;
        }

        .swiper-button-next.swiper-nav-custom {
            right: 0;
        }

        .swiper-pagination-bullet-active {
            background: var(--gold);
            width: 25px;
            border-radius: 5px;
        }

        @media (max-width: 767px) {
            .swiper-nav-custom {
                display: none;
            }

            .popular-courses-slider {
                padding-bottom: 50px;
            }
        }

        .course-modern-card {
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            border: 1px solid #f1f5f9;
            transition: all 0.3s;
            margin-bottom: 30px;
        }

        .course-modern-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        }

        .course-thumb {
            position: relative;
            height: 230px;
            overflow: hidden;
        }

        .course-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.6s;
        }

        .course-modern-card:hover .course-thumb img {
            transform: scale(1.1);
        }

        .price-badge {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: white;
            color: var(--dark-navy);
            font-weight: 900;
            padding: 10px 18px;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            font-size: 15px;
        }

        .course-content {
            padding: 35px;
        }

        .course-name {
            font-size: 22px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 15px;
            line-height: 1.3;
            height: 58px;
            overflow: hidden;
        }

        .course-excerpt {
            color: #64748b;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.7;
            height: 80px;
            overflow: hidden;
        }

        .course-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 25px;
        }

        .instructor {
            font-size: 14px;
            font-weight: 700;
            color: #94a3b8;
        }

        .btn-link-gold {
            color: var(--gold);
            font-weight: 800;
            font-size: 15px;
            text-decoration: none !important;
            transition: 0.3s;
        }

        .btn-link-gold:hover {
            color: var(--gold-dark);
            transform: translateX(5px);
        }

        /* About Premium */
        .about-premium-section {
            padding: 140px 0;
            background: #f8fafc;
        }

        .about-visual {
            position: relative;
            padding-right: 40px;
        }

        .img-main {
            width: 100%;
            border-radius: 40px;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
            border: 10px solid white;
            height: 500px;
            object-fit: cover;
        }

        .experience-tag {
            position: absolute;
            bottom: -30px;
            right: 10px;
            background: #0f172a;
            color: white;
            padding: 35px;
            border-radius: 30px;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .experience-tag span {
            display: block;
            font-size: 42px;
            font-weight: 900;
            color: var(--gold);
        }

        .about-text {
            position: relative;
        }

        .section-heading {
            font-size: 52px;
            font-weight: 900;
            color: #1e293b;
            line-height: 1.1;
        }

        .about-rich-text {
            font-size: 18px;
            line-height: 2;
            color: #4b5563;
        }

        .text-gold {
            color: var(--gold) !important;
        }

        /* CTA Ultimate */
        .cta-premium-banner {
            padding: 80px 0 140px;
            background: white;
        }

        .cta-inner {
            background: linear-gradient(145deg, #0f172a, #1e293b);
            padding: 110px 80px;
            border-radius: 50px;
            color: white;
            box-shadow: 0 30px 90px rgba(15, 23, 42, 0.4);
            position: relative;
            overflow: hidden;
        }

        .cta-inner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://www.transparenttextures.com/patterns/cubes.png');
            opacity: 0.1;
        }

        .cta-inner h2 {
            font-size: 56px;
            font-weight: 900;
            margin-bottom: 25px;
            position: relative;
        }

        .cta-inner p {
            font-size: 20px;
            margin-bottom: 50px;
            opacity: 0.8;
            position: relative;
        }

        .btn-cta-gold {
            background: var(--gold);
            color: white !important;
            padding: 22px 60px;
            border-radius: 16px;
            font-weight: 800;
            font-size: 20px;
            text-decoration: none;
            display: inline-block;
            transition: 0.3s;
            position: relative;
            box-shadow: 0 15px 30px rgba(245, 158, 11, 0.4);
        }

        .btn-cta-gold:hover {
            transform: translateY(-5px) scale(1.02);
            text-decoration: none;
            color: white !important;
        }

        @media (max-width: 991px) {
            .hero-title-premium {
                font-size: 48px;
                text-align: center;
            }

            .hero-subtitle-premium {
                text-align: center;
                margin: 0 auto 40px;
            }

            .hero-btns {
                text-align: center;
            }

            .stat-item {
                border-right: none;
                margin-bottom: 40px;
            }

            .section-heading {
                font-size: 38px;
            }

            .cta-inner {
                padding: 80px 40px;
            }

            .cta-inner h2 {
                font-size: 36px;
            }

            .experience-tag {
                padding: 20px;
            }

            .img-main {
                height: auto;
            }
        }
    </style>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Hero Slider
            // Hero Slider
            const heroSwiper = new Swiper('.hero-swiper', {
                effect: 'fade',
                loop: true,
                speed: 1000,
                autoplay: {
                    delay: 6000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.hero-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.hero-swiper .swiper-button-next',
                    prevEl: '.hero-swiper .swiper-button-prev',
                },
            });

            // Popular Courses Slider
            const coursesSwiper = new Swiper('.popular-courses-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                centeredSlides: false,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.popular-courses-slider .swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: {
                    nextEl: '.popular-courses-slider .swiper-button-next',
                    prevEl: '.popular-courses-slider .swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 1
                    },
                    768: {
                        slidesPerView: 2
                    },
                    1024: {
                        slidesPerView: 3
                    },
                }
            });
        });
    </script>
@endsection
