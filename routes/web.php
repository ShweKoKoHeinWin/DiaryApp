<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\DiaryController;
use App\Http\Controllers\EmotionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShareController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/calendar', [HomeController::class, 'calendar'])->name('calendar');

    Route::prefix('/categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/store', [CategoryController::class, 'store'])->name('categories.store');
        Route::post('/{category}/update', [CategoryController::class, 'update'])->name('categories.update')->can('update', 'category');
        Route::delete('/{category}/delete', [CategoryController::class, 'destroy'])->name('categories.delete')->can('delete', 'category');
    });

    Route::prefix('/emotions')->group(function () {
        Route::get('/', [EmotionController::class, 'index'])->name('emotions.index');
        Route::post('/store', [EmotionController::class, 'store'])->name('emotions.store');
        Route::post('/{emotion}/update', [EmotionController::class, 'update'])->name('emotions.update')->can('update', 'emotion');
        Route::delete('/{emotion}/delete', [EmotionController::class, 'destroy'])->name('emotions.delete')->can('delete', 'emotion');
    });

    Route::prefix('/diaries')->group(function () {
        Route::get('/', fn () => redirect()->route('diaries.index'))->name('diaries'); 

        Route::get('/index', [DiaryController::class, 'index'])->name('diaries.index');
        Route::get('/create', [DiaryController::class, 'create'])->name('diaries.create');
        Route::post('/store', [DiaryController::class, 'store'])->name('diaries.store');
        Route::get('/{diary}/edit', [DiaryController::class, 'edit'])->name('diaries.edit');
        Route::post('/{diary}/update', [DiaryController::class, 'update'])->name('diaries.update');
        Route::get('/{diary}', [DiaryController::class, 'show'])->name('diaries.show');
        Route::delete('/{diary}/delete', [DiaryController::class, 'destroy'])->name('diaries.delete');

        Route::put('/{diary}/collections', [DiaryController::class, 'collections'])->name('diaries.collections');
        Route::put('/{diary}/shares', [DiaryController::class, 'shares'])->name('diaries.shares');
    });

    Route::prefix('/inbox-shares')->group(function () {
        Route::get('/', fn () => redirect()->route('inbox-shares.users'))->name('inbox-shares'); 
        Route::get('/shares', [ShareController::class, 'sharedItems'])->name('inbox-shares.shares');
        Route::get('/inbox', [ShareController::class, 'inboxItems'])->name('inbox-shares.inbox');
        Route::get('/users', [ShareController::class, 'users'])->name('inbox-shares.users');
        Route::put('/multishare', [ShareController::class, 'multishare'])->name('inbox-shares.multishare');
    });

    Route::prefix('/collections')->group(function () {
        Route::get('/', [CollectionController::class, 'index'])->name('collections.index');
        Route::get('/create', [CollectionController::class, 'create'])->name('collections.create');
        Route::post('/store', [CollectionController::class, 'store'])->name('collections.store');
        Route::put('/{collection}/update', [CollectionController::class, 'update'])->name('collections.update');
        Route::get('/{collection}', [CollectionController::class, 'show'])->name('collections.show');
        Route::delete('/{collection}/delete', [CollectionController::class, 'destroy'])->name('collections.delete');

        Route::put('/{collection}/shares', [CollectionController::class, 'shares'])->name('collections.shares');
        Route::put('/{collection}/diaries/remove', [CollectionController::class, 'removeDiaries'])->name('collections.diaries.remove');
        Route::put('/diaries/add', [CollectionController::class, 'addDiaries'])->name('collections.diaries.add');


    });

    Route::get('/files', function() {

    })->name('files.index');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
