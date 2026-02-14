<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $plans = \App\Models\Plan::where('is_active', true)->get();
    return view('landing', compact('plans'));
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::middleware('auth')->get('/api/me', [App\Http\Controllers\UserController::class, 'me']);

// Public Academy Pages
Route::get('/academy/{slug}', [App\Http\Controllers\AcademyController::class, 'show'])->name('academy.show');
Route::get('/academy/{slug}/courses', [App\Http\Controllers\AcademyController::class, 'courses'])->name('academy.courses');
Route::get('/academy/{academy_slug}/course/{course_slug}', [App\Http\Controllers\AcademyController::class, 'course'])->name('course.show');

// React SPA Catch-all (to ensure /dashboard and others work)
Route::middleware(['auth', 'saas.active'])->group(function () {
    Route::get('/dashboard/my-courses', function() { return view('dashboard'); })->name('dashboard.my-courses');
    Route::get('/dashboard/{any?}', [App\Http\Controllers\HomeController::class, 'index'])->where('any', '.*')->name('dashboard');

    // API for React Components
    Route::get('/api/user/my-courses', [App\Http\Controllers\EnrollmentController::class, 'myCourses']);
    Route::get('/api/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'stats']);
});

// Enrollment Action
Route::middleware('auth')->post('/enroll/{course_id}', [App\Http\Controllers\EnrollmentController::class, 'enroll'])->name('enroll');

// SaaS Onboarding Flow
Route::middleware('auth')->group(function () {
    Route::get('/checkout/{plan_slug}', [App\Http\Controllers\CheckoutController::class, 'createSession'])->name('checkout.session');
    Route::post('/checkout/process', [App\Http\Controllers\CheckoutController::class, 'processCheckout'])->name('checkout.process');
});

// Academy Management API
Route::middleware(['auth', 'saas.active'])->prefix('api/academy')->group(function () {
    Route::get('/settings', [App\Http\Controllers\AcademySettingsController::class, 'index']);
    Route::put('/settings', [App\Http\Controllers\AcademySettingsController::class, 'update']);

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
});

// Stripe Webhooks (Excluded from CSRF in bootstrap/app.php)
Route::post('/stripe/webhook', [App\Http\Controllers\WebhookController::class, 'handleWebhook']);
