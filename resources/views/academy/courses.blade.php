@extends('layouts.academy')

@section('title', 'Toutes les formations - ' . $tenant->name)

@section('content')
    <!-- Inner Header -->
    <section class="inner-header bg-dark-navy py-5">
        <div class="container text-center text-white py-4">
            <span class="badge-premium mb-3">Catalogue Complet</span>
            <h1 class="display-4 font-weight-bold mb-3">Toutes nos Formations</h1>
            <p class="lead opacity-75">Explorez notre catalogue complet et trouvez la formation qui vous correspond.</p>
        </div>
    </section>

    <!-- Courses Listing -->
    <section class="courses-grid-section py-5">
        <div class="container">
            <div class="row align-items-center mb-5">
                <div class="col-md-6">
                    <h3 class="mb-0">{{ $courses->total() }} formations disponibles</h3>
                </div>
                <div class="col-md-6 text-md-right">
                    <span class="text-muted">Filtrer par catégorie (Bientôt)</span>
                </div>
            </div>

            <div class="row">
                @forelse($courses as $course)
                    <div class="col-md-4 mb-4">
                        <div class="course-modern-card">
                            <div class="course-thumb">
                                <img src="{{ $course->thumbnail ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800' }}"
                                    alt="{{ $course->title }}">
                                <div class="price-badge">{{ $course->is_free ? 'GRATUIT' : $course->price . ' $' }}</div>
                            </div>
                            <div class="course-content">
                                <h3 class="course-name">{{ $course->title }}</h3>
                                <p class="course-excerpt">{{ Str::limit($course->short_description, 85) }}</p>
                                <div class="course-footer">
                                    <span class="instructor"><i class="fa fa-user"></i> {{ $tenant->owner->name }}</span>
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
                            <p class="text-muted">Aucune formation trouvée pour le moment.</p>
                        </div>
                    </div>
                @endforelse
            </div>

            <div class="d-flex justify-content-center mt-5">
                {{ $courses->links() }}
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
        }

        .bg-dark-navy {
            background: #0f172a;
        }

        .badge-premium {
            background: rgba(245, 158, 11, 0.2);
            color: var(--gold);
            padding: 8px 20px;
            border-radius: 50px;
            font-weight: 800;
            border: 1px solid rgba(245, 158, 11, 0.3);
            display: inline-block;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }

        .course-modern-card {
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            border: 1px solid #f1f5f9;
            transition: all 0.3s;
            margin-bottom: 20px;
            height: 100%;
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

        /* Pagination Style override */
        .pagination .page-item.active .page-link {
            background-color: var(--gold);
            border-color: var(--gold);
        }

        .pagination .page-link {
            color: var(--dark-navy);
            border-radius: 8px;
            margin: 0 3px;
        }
    </style>
@endsection
