<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Diary;
use App\Models\Emotion;
use App\Policies\CategoryPolicy;
use App\Policies\DiaryPolicy;
use App\Policies\EmotionPolicy;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
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
        JsonResource::withoutWrapping();
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Emotion::class, EmotionPolicy::class);
        Gate::policy(Diary::class, DiaryPolicy::class);
    }
}
