<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $plans = \App\Models\Plan::where('is_active', true)->get();
    return view('landing_react', compact('plans'));
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::middleware('auth')->get('/api/me', [App\Http\Controllers\UserController::class, 'me']);

// Public Academy Pages
Route::get('/academy/{slug}', [App\Http\Controllers\AcademyController::class, 'show'])->name('academy.show');
Route::get('/academy/{slug}/courses', [App\Http\Controllers\AcademyController::class, 'courses'])->name('academy.courses');
Route::get('/academy/{academy_slug}/course/{course_slug}', [App\Http\Controllers\AcademyController::class, 'course'])->name('course.show');

// Course Player (Learning Interface)
Route::middleware(['auth'])->group(function () {
    Route::get('/academy/{academy_slug}/learn/{course_slug}/{lesson_slug?}', [App\Http\Controllers\CoursePlayerController::class, 'show'])->name('course.learn');
    Route::post('/lesson/{lesson_id}/complete', [App\Http\Controllers\CoursePlayerController::class, 'complete'])->name('lesson.complete');
});

// React SPA Catch-all (to ensure /dashboard and others work)
Route::middleware(['auth', 'saas.active'])->group(function () {
    Route::get('/dashboard/my-courses', function() { return view('dashboard'); })->name('dashboard.my-courses');
    Route::get('/dashboard/{any?}', [App\Http\Controllers\HomeController::class, 'index'])->where('any', '.*')->name('dashboard');

    // API for React Components
    Route::get('/api/user/my-courses', [App\Http\Controllers\EnrollmentController::class, 'myCourses']);
    Route::get('/api/user/certificates', [App\Http\Controllers\EnrollmentController::class, 'myCertificates']);
    Route::get('/api/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'stats']);
});

// Enrollment Action
Route::middleware('auth')->post('/enroll/{course_id}', [App\Http\Controllers\EnrollmentController::class, 'enroll'])->name('enroll');

// Certificate (authenticated user only)
Route::middleware('auth')->get('/certificate/{uuid}', [App\Http\Controllers\CertificateController::class, 'show'])->name('certificate.show');

// SaaS Onboarding Flow
Route::middleware('auth')->group(function () {
    Route::get('/checkout/{plan_slug}', [App\Http\Controllers\CheckoutController::class, 'createSession'])->name('checkout.session');
    Route::post('/checkout/process', [App\Http\Controllers\CheckoutController::class, 'processCheckout'])->name('checkout.process');
});

// Academy Management API
Route::middleware(['auth', 'saas.active'])->prefix('api/academy')->group(function () {
    Route::get('/settings', [App\Http\Controllers\AcademySettingsController::class, 'index']);
    Route::put('/settings', [App\Http\Controllers\AcademySettingsController::class, 'update']);

    Route::get('/quota', [App\Http\Controllers\QuotaController::class, 'index']);

    // Students List & Profile (academy owner view)
    Route::get('/students', [App\Http\Controllers\StudentController::class, 'index']);
    Route::get('/students/{id}', [App\Http\Controllers\StudentController::class, 'show']);

    // Instructor Management
    Route::get('/instructors', [App\Http\Controllers\InstructorController::class, 'index']);
    Route::post('/instructors', [App\Http\Controllers\InstructorController::class, 'store']);
    Route::delete('/instructors/{id}', [App\Http\Controllers\InstructorController::class, 'destroy']);

    // Course Creation Flow
    Route::apiResource('courses', App\Http\Controllers\CourseController::class);
    Route::apiResource('modules', App\Http\Controllers\ModuleController::class)->only(['update', 'destroy']);
    Route::post('/courses/{course}/modules', [App\Http\Controllers\ModuleController::class, 'store']);
    
    Route::apiResource('lessons', App\Http\Controllers\LessonController::class)->only(['update', 'destroy']);
    Route::post('/modules/{module}/lessons', [App\Http\Controllers\LessonController::class, 'store']);

    // CMS Pages
    Route::apiResource('pages', App\Http\Controllers\PageController::class);
});

// Other Public Academy Routes
Route::get('/academy/{slug}/p/{page_slug}', [App\Http\Controllers\PageController::class, 'publicPage'])->name('page.show');

// Admin API Routes
Route::middleware(['auth'])->prefix('api/admin')->group(function () {
    Route::apiResource('plans', App\Http\Controllers\Admin\PlanController::class);
    Route::apiResource('tenants', App\Http\Controllers\Admin\TenantController::class)->only(['index', 'store', 'show', 'update']);
    Route::apiResource('users', App\Http\Controllers\Admin\UserController::class)->only(['index', 'show']);
    
    // Onboarding Management
    Route::get('/onboarding-requests', [App\Http\Controllers\OnboardingController::class, 'index']);
    Route::get('/onboarding-requests/{id}', [App\Http\Controllers\OnboardingController::class, 'show']);
    Route::patch('/onboarding-requests/{id}', [App\Http\Controllers\OnboardingController::class, 'update']);
    Route::put('/onboarding-requests/{id}/status', [App\Http\Controllers\OnboardingController::class, 'updateStatus']);
    Route::post('/onboarding-requests/{id}/deploy', [App\Http\Controllers\OnboardingController::class, 'deploy']);

    // Registration of Platform Settings
    Route::get('/settings', [App\Http\Controllers\Admin\SystemSettingsController::class, 'index']);
    Route::post('/settings', [App\Http\Controllers\Admin\SystemSettingsController::class, 'update']);
    Route::post('/settings/setup', [App\Http\Controllers\Admin\SystemSettingsController::class, 'setupDefaults']);
});

// Public Onboarding Routes
Route::get('/onboarding', function () {
    $plans = \App\Models\Plan::where('is_active', true)->get();
    return view('onboarding', compact('plans'));
})->name('onboarding');

Route::post('/api/onboarding', [App\Http\Controllers\OnboardingController::class, 'store']);

// Stripe Webhooks (Excluded from CSRF in bootstrap/app.php)
Route::post('/stripe/webhook', [App\Http\Controllers\WebhookController::class, 'handleWebhook']);
