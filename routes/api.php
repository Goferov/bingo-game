<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BingoController;
use App\Http\Controllers\Api\RankingController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/bingo/today', [BingoController::class, 'getTodayCard']);
    Route::post('/bingo/create', [BingoController::class, 'createTodayCard']);
    Route::post('/bingo/mark', [BingoController::class, 'markTile']);
    Route::post('/bingo/claim-win', [BingoController::class, 'ClaimWin']);
    Route::post('/bingo/has-bingo', [BingoController::class, 'HasBingoStatus']);
});

Route::get('/ranking', [RankingController::class, 'index'])->middleware('auth:sanctum');;
