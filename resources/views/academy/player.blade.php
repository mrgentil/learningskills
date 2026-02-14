@extends('layouts.academy')

@section('title', $currentLesson->title . ' - ' . $course->title)

@section('content')
    <div class="learning-player-outer">
        <!-- Player Sidebar -->
        <div class="player-sidebar">
            <div class="ps-header">
                <a href="{{ route('course.show', [$tenant->slug, $course->slug]) }}" class="back-link">
                    <i class="fa fa-arrow-left"></i> Retour au cours
                </a>
                <h5 class="mt-3 text-white font-weight-bold">{{ $course->title }}</h5>

                @php
                    $totalLessons = $course->modules->sum(fn($m) => $m->lessons->count());
                    $completedCount = count($completions);
                    $progressPercent = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;
                @endphp

                <div class="ps-progress-box mt-4">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="small font-weight-bold text-white-50">PROGRESSION</span>
                        <span class="small font-weight-bold text-gold">{{ $progressPercent }}%</span>
                    </div>
                    <div class="progress progress-stun">
                        <div class="progress-bar bg-gold" role="progressbar" style="width: {{ $progressPercent }}%"></div>
                    </div>
                </div>
            </div>

            <div class="ps-curriculum">
                @foreach ($course->modules as $module)
                    <div class="ps-module">
                        <div class="ps-module-name">{{ $module->title }}</div>
                        <div class="ps-lessons-list">
                            @foreach ($module->lessons as $lesson)
                                @php $isCompleted = in_array($lesson->id, $completions); @endphp
                                <a href="{{ route('course.learn', [$tenant->slug, $course->slug, $lesson->slug]) }}"
                                    class="ps-lesson-item {{ $currentLesson->id == $lesson->id ? 'active' : '' }} {{ $isCompleted ? 'completed' : '' }}">
                                    <div class="l-status">
                                        <i class="fa {{ $isCompleted ? 'fa-check-circle' : 'fa-play-circle' }}"></i>
                                    </div>
                                    <div class="l-title">{{ $lesson->title }}</div>
                                    @if ($lesson->duration)
                                        <div class="l-duration">{{ $lesson->duration }}</div>
                                    @endif
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Main Player Area -->
        <div class="player-main">
            <div class="pm-content">
                <!-- Media Container -->
                <div class="pm-media-box shadow-lg">
                    @if ($currentLesson->video_url)
                        @php
                            $isYoutube =
                                str_contains($currentLesson->video_url, 'youtube.com') ||
                                str_contains($currentLesson->video_url, 'youtu.be');
                            $isVimeo = str_contains($currentLesson->video_url, 'vimeo.com');
                        @endphp

                        @if ($isYoutube)
                            @php
                                $videoId = '';
                                if (
                                    preg_match(
                                        '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i',
                                        $currentLesson->video_url,
                                        $match,
                                    )
                                ) {
                                    $videoId = $match[1];
                                }
                            @endphp
                            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/{{ $videoId }}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                        @elseif($isVimeo)
                            <!-- Vimeo placeholder -->
                            <div class="bg-dark d-flex align-items-center justify-content-center text-white h-100">Lecteur
                                Vimeo à intégrer</div>
                        @else
                            <video controls class="w-100 h-100">
                                <source src="{{ $currentLesson->video_url }}" type="video/mp4">
                                Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                        @endif
                    @else
                        <div class="pm-no-video">
                            <i class="fa fa-file-alt fa-3x mb-3 text-gold-dim"></i>
                            <p>Cette leçon est au format texte/lecture</p>
                        </div>
                    @endif
                </div>

                <!-- Lesson Info -->
                <div class="pm-info p-5">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h1 class="pm-lesson-title">{{ $currentLesson->title }}</h1>
                            <p class="text-muted font-weight-bold">{{ $course->title }} • Module:
                                {{ $currentLesson->module->title }}</p>
                        </div>
                        <div>
                            @if (!in_array($currentLesson->id, $completions))
                                <button id="btn-complete-lesson" data-id="{{ $currentLesson->id }}"
                                    class="btn-complete-premium">
                                    <i class="fa fa-check mr-2"></i> Marquer comme terminé
                                </button>
                            @else
                                <div class="badge-completed-status">
                                    <i class="fa fa-check-double mr-2"></i> Leçon Terminée
                                </div>
                            @endif
                        </div>
                    </div>

                    <div class="pm-lesson-body rich-text-content mt-5">
                        {!! $currentLesson->content !!}
                    </div>
                </div>
            </div>

            <!-- Player Footer Nav -->
            <div class="pm-footer">
                <div class="container-fluid d-flex justify-content-between align-items-center h-100 px-5">
                    @php
                        $allLessons = $course->modules->flatMap->lessons;
                        $currentIndex = $allLessons->search(fn($l) => $l->id == $currentLesson->id);
                        $prevLesson = $currentIndex > 0 ? $allLessons[$currentIndex - 1] : null;
                        $nextLesson = $currentIndex < $allLessons->count() - 1 ? $allLessons[$currentIndex + 1] : null;
                    @endphp

                    <a href="{{ $prevLesson ? route('course.learn', [$tenant->slug, $course->slug, $prevLesson->slug]) : '#' }}"
                        class="btn-player-nav {{ !$prevLesson ? 'disabled' : '' }}">
                        <i class="fa fa-chevron-left mr-2"></i> Précédent
                    </a>

                    <span class="small font-weight-bold text-muted text-uppercase letter-spacing-1">
                        Leçon {{ $currentIndex + 1 }} sur {{ $allLessons->count() }}
                    </span>

                    <a href="{{ $nextLesson ? route('course.learn', [$tenant->slug, $course->slug, $nextLesson->slug]) : '#' }}"
                        class="btn-player-nav {{ !$nextLesson ? 'disabled' : '' }}">
                        Suivant <i class="fa fa-chevron-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('styles')
    <style>
        /* Absolute Layout for Player */
        nav.navbar {
            display: none !important;
        }

        /* Hide main navbar */
        footer.footer {
            display: none !important;
        }

        /* Hide main footer */

        body {
            overflow: hidden;
            background: #0f172a;
        }

        .learning-player-outer {
            display: flex;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
        }

        /* Sidebar */
        .player-sidebar {
            width: 350px;
            background: #1e293b;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            color: white;
            z-index: 100;
        }

        .ps-header {
            padding: 30px;
            background: #0f172a;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .back-link {
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none !important;
            font-weight: 700;
            font-size: 13px;
        }

        .back-link:hover {
            color: #f59e0b;
        }

        .progress-stun {
            height: 8px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
        }

        .text-white-50 {
            color: rgba(255, 255, 255, 0.5) !important;
        }

        .text-gold {
            color: #f59e0b !important;
        }

        .bg-gold {
            background-color: #f59e0b !important;
        }

        .ps-curriculum {
            flex: 1;
            overflow-y: auto;
            padding-bottom: 50px;
        }

        .ps-module-name {
            padding: 20px 30px;
            background: rgba(0, 0, 0, 0.15);
            font-weight: 800;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #f59e0b;
        }

        .ps-lesson-item {
            display: flex;
            align-items: center;
            padding: 18px 30px;
            text-decoration: none !important;
            color: rgba(255, 255, 255, 0.7);
            transition: 0.2s;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .ps-lesson-item:hover {
            background: rgba(255, 255, 255, 0.03);
            color: white;
        }

        .ps-lesson-item.active {
            background: #f59e0b;
            color: white !important;
        }

        .ps-lesson-item.completed .l-status i {
            color: #10b981;
        }

        .ps-lesson-item.active .l-status i {
            color: white;
        }

        .l-status {
            width: 30px;
            font-size: 18px;
            margin-right: 10px;
        }

        .l-title {
            flex: 1;
            font-weight: 700;
            font-size: 14px;
        }

        .l-duration {
            font-size: 11px;
            opacity: 0.5;
            font-weight: 700;
        }

        /* Main Area */
        .player-main {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: white;
            overflow-y: auto;
        }

        .pm-content {
            flex: 1;
            overflow-y: auto;
        }

        .pm-media-box {
            aspect-ratio: 16/9;
            background: #000;
            width: 100%;
            max-height: 80vh;
        }

        .pm-no-video {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            color: #64748b;
            font-weight: 700;
        }

        .pm-lesson-title {
            font-size: 36px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 10px;
        }

        .btn-complete-premium {
            background: #f59e0b;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 15px;
            transition: 0.3s;
            box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2);
        }

        .btn-complete-premium:hover {
            background: #d97706;
            transform: translateY(-2px);
        }

        .badge-completed-status {
            padding: 14px 28px;
            border-radius: 12px;
            background: #ecfdf5;
            color: #10b981;
            font-weight: 800;
            font-size: 15px;
            border: 1px solid #d1fae5;
        }

        .pm-lesson-body {
            font-size: 19px;
            line-height: 2;
            color: #334155;
        }

        /* Nav Footer */
        .pm-footer {
            height: 80px;
            background: #ffffff;
            border-top: 1px solid #f1f5f9;
            z-index: 100;
        }

        .btn-player-nav {
            color: #0f172a;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 1px;
            text-decoration: none !important;
            padding: 12px 20px;
            border-radius: 10px;
            transition: 0.2s;
        }

        .btn-player-nav:hover:not(.disabled) {
            background: #f8fafc;
            color: #f59e0b;
        }

        .btn-player-nav.disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .text-gold-dim {
            color: rgba(245, 158, 11, 0.3);
        }
    </style>
@endsection

@section('scripts')
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const btnComplete = document.getElementById('btn-complete-lesson');

            if (btnComplete) {
                btnComplete.addEventListener('click', function() {
                    const lessonId = this.dataset.id;

                    this.disabled = true;
                    this.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> Traitement...';

                    fetch(`/lesson/${lessonId}/complete`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': '{{ csrf_token() }}'
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                let timerInterval;
                                Swal.fire({
                                    title: 'Leçon terminée ! 🥳',
                                    html: data.next_lesson_url ?
                                        'Bravo ! Passage à la leçon suivante dans <b></b> ms...' :
                                        'Félicitations ! Vous avez terminé ce chapitre.',
                                    icon: 'success',
                                    timer: 2000,
                                    timerProgressBar: true,
                                    didOpen: () => {
                                        Swal.showLoading();
                                        const b = Swal.getHtmlContainer().querySelector(
                                        'b');
                                        if (b) {
                                            timerInterval = setInterval(() => {
                                                b.textContent = Swal.getTimerLeft();
                                            }, 100);
                                        }
                                    },
                                    willClose: () => {
                                        if (timerInterval) clearInterval(timerInterval);
                                    }
                                }).then(() => {
                                    if (data.next_lesson_url) {
                                        window.location.href = data.next_lesson_url;
                                    } else {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                Swal.fire('Erreur', data.error || 'Erreur lors de la validation',
                                    'error');
                                this.disabled = false;
                                this.innerHTML =
                                    '<i class="fa fa-check mr-2"></i> Marquer comme terminé';
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire('Erreur', 'Impossible de contacter le serveur', 'error');
                            this.disabled = false;
                            this.innerHTML = '<i class="fa fa-check mr-2"></i> Marquer comme terminé';
                        });
                });
            }
        });
    </script>
@endsection
