@extends('layouts.academy')

@section('title', $course->title . ' - ' . $tenant->name)

@section('content')
    <div class="course-header" style="background: white; padding: 80px 0; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
            <div class="row">
                <div class="col-md-8">
                    <span class="course-badge"
                        style="background: #f59e0b15; color: #f59e0b; padding: 5px 15px; border-radius: 20px; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-bottom: 15px; display: inline-block;">
                        {{ $course->is_free ? 'Cours Gratuit' : 'Formation Premium' }}
                    </span>
                    <h1 style="font-weight: 900; font-size: 42px; margin-bottom: 25px; color: #1e293b;">
                        {{ $course->title }}
                    </h1>
                    <p style="font-size: 18px; color: #64748b; line-height: 1.8; margin-bottom: 40px;">
                        {{ $course->short_description }}
                    </p>

                    <div
                        style="background: #f1f5f9; padding: 25px; border-radius: 15px; display: inline-flex; align-items: center; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fa fa-user-circle fa-2x" style="color: #cbd5e1;"></i>
                            <div>
                                <small style="color: #94a3b8; display: block; font-weight: 700;">Instructeur</small>
                                <span style="font-weight: 700;">{{ $tenant->owner->name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="padding: 60px 0;">
        <div class="row">
            <div class="col-md-8">
                <h3 style="font-weight: 800; margin-bottom: 25px;">Description du cours</h3>
                <div
                    style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); line-height: 1.8; font-size: 17px; color: #334155;">
                    {!! $course->description !!}
                </div>
            </div>
            <div class="col-md-4">
                <div class="sidebar-card text-center"
                    style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06); position: sticky; top: 30px;">
                    <div style="font-size: 32px; font-weight: 900; color: #1e293b; margin-bottom: 25px;">
                        {{ $course->is_free ? 'Gratuit' : $course->price . ' $' }}
                    </div>

                    <form action="{{ route('enroll', $course->id) }}" method="POST">
                        @csrf
                        <button type="submit" class="btn-enroll-lg w-100"
                            style="background: var(--primary); color: white; font-weight: 800; padding: 18px 40px; border-radius: 4px; font-size: 18px; border: none; transition: 0.3s;">
                            S'inscrire maintenant
                        </button>
                    </form>

                    <div style="margin-top: 30px; text-align: left; font-size: 14px; color: #64748b;">
                        <h5 style="font-weight: 800; color: #1e293b; margin-bottom: 15px;">Ce qui est inclus :</h5>
                        <ul style="list-style: none; padding-left: 0; line-height: 2.5;">
                            <li><i class="fa fa-check-circle" style="color: #48bb78;"></i> Accès à vie</li>
                            <li><i class="fa fa-check-circle" style="color: #48bb78;"></i> Support prioritaire</li>
                            <li><i class="fa fa-check-circle" style="color: #48bb78;"></i> Certificat de réussite</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
