<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DiaryController;
use App\Http\Controllers\EmotionController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/calendar', [HomeController::class, 'calendar'])->name('calendar');

    Route::prefix('/categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/store', [CategoryController::class, 'store'])->name('categories.store');
        Route::post('/{category}/update', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/{category}/delete', [CategoryController::class, 'destroy'])->name('categories.delete');
    });

    Route::prefix('/emotions')->group(function () {
        Route::get('/', [EmotionController::class, 'index'])->name('emotions.index');
        Route::post('/store', [EmotionController::class, 'store'])->name('emotions.store');
        Route::post('/{emotion}/update', [EmotionController::class, 'update'])->name('emotions.update');
        Route::delete('/{emotion}/delete', [EmotionController::class, 'destroy'])->name('emotions.delete');
    });


    Route::prefix('/diaries')->group(function () {
        Route::get('/', [DiaryController::class, 'index'])->name('diaries.index');
        Route::post('/store', [DiaryController::class, 'store'])->name('diaries.store');
        Route::post('/{diary}/update', [DiaryController::class, 'update'])->name('diaries.update');
        Route::delete('/{diary}/delete', [DiaryController::class, 'destroy'])->name('diaries.delete');
    });
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
