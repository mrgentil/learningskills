<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        view()->composer('layouts.academy', function ($view) {
            $data = $view->getData();
            $tenant = $data['tenant'] ?? null;
            if ($tenant) {
                $view->with('pages', $tenant->pages()->where('is_published', true)->get());
            }
        });
    }
}
