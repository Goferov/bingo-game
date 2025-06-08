<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BingoCard;
use App\Models\BingoTile;
use App\Models\DailyGame;
use App\Models\Event;
use App\Models\GameSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BingoController extends Controller
{
    public function getTodayCard(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $dailyGame = DailyGame::with('winner')->firstOrCreate(['date' => $today]);

        if (!$dailyGame) {
            return response()->json(['message' => 'Brak gry na dziś'], 404);
        }

        $card = BingoCard::with(['tiles.event'])->where('user_id', $user->id)
            ->where('daily_game_id', $dailyGame->id)
            ->first();

        if (!$card) {
            return response()->json(['message' => 'Nie masz jeszcze planszy na dziś'], 404);
        }

        return response()->json([
            'card_id' => $card->id,
            'tiles' => $card->tiles->map(fn($tile) => [
                'id' => $tile->id,
                'row' => $tile->row_index,
                'col' => $tile->col_index,
                'marked' => $tile->marked,
                'event' => [
                    'id' => $tile->event->id,
                    'description' => $tile->event->description,
                    'image_url' => $tile->event->image_url,
                ]
            ]),
            'game_status' => [
                'winner_user_id' => $dailyGame->winner_user_id,
                'is_finished' => $dailyGame->winner_user_id !== null,
                'is_user_winner' => $dailyGame->winner_user_id === $user->id,
                'winner_user' => $dailyGame->winner_user_id
                    ? [
                        'id' => $dailyGame->winner->id,
                        'name' => $dailyGame->winner->name,
                    ]
                    : null,
            ]
        ]);
    }


    public function createTodayCard(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $dailyGame = DailyGame::firstOrCreate(['date' => $today]);

        $existing = BingoCard::where('user_id', $user->id)
            ->where('daily_game_id', $dailyGame->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Plansza już istnieje'], 409);
        }

        $gridSize = GameSetting::latest()->first()?->grid_size ?? 5;
        $eventCount = $gridSize * $gridSize;
        $events = Event::where('enabled', true)->inRandomOrder()->take($eventCount)->get();

        if ($events->count() < $eventCount) {
            return response()->json(['message' => 'Za mało zdarzeń, aby wygenerować planszę'], 400);
        }

        DB::beginTransaction();

        $card = BingoCard::create([
            'user_id' => $user->id,
            'daily_game_id' => $dailyGame->id,
        ]);

        $i = 0;
        for ($row = 0; $row < $gridSize; $row++) {
            for ($col = 0; $col < $gridSize; $col++) {
                BingoTile::create([
                    'bingo_card_id' => $card->id,
                    'row_index' => $row,
                    'col_index' => $col,
                    'event_id' => $events[$i]->id,
                    'marked' => false,
                ]);
                $i++;
            }
        }

        DB::commit();

        return response()->json(['message' => 'Plansza utworzona']);
    }

    public function markTile(Request $request)
    {
        $request->validate([
            'tile_id' => 'required|exists:bingo_tiles,id',
        ]);

        $tile = BingoTile::with('card')->findOrFail($request->tile_id);

        if ($tile->card->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Nie możesz zaznaczyć tego pola'], 403);
        }

        $tile->update([
            'marked' => !$tile->marked,
            'marked_at' => now(),
        ]);

        return response()->json(['message' => 'Zaznaczono']);
    }

    private function hasBingo(BingoCard $card): bool
    {
        $size = sqrt($card->tiles->count());
        $grid = [];

        for ($r = 0; $r < $size; $r++) {
            for ($c = 0; $c < $size; $c++) {
                $grid[$r][$c] = false;
            }
        }

        foreach ($card->tiles as $tile) {
            $grid[$tile->row_index][$tile->col_index] = (bool) $tile->marked;
        }

        // RZĘDY
        for ($r = 0; $r < $size; $r++) {
            $allMarked = true;
            for ($c = 0; $c < $size; $c++) {
                if (!$grid[$r][$c]) {
                    $allMarked = false;
                    break;
                }
            }
            if ($allMarked) return true;
        }

        // KOLUMNY
        for ($c = 0; $c < $size; $c++) {
            $allMarked = true;
            for ($r = 0; $r < $size; $r++) {
                if (!$grid[$r][$c]) {
                    $allMarked = false;
                    break;
                }
            }
            if ($allMarked) return true;
        }

        // PRZEKĄTNA \
        $diagonal1 = true;
        for ($i = 0; $i < $size; $i++) {
            if (!$grid[$i][$i]) {
                $diagonal1 = false;
                break;
            }
        }
        if ($diagonal1) return true;

        // PRZEKĄTNA /
        $diagonal2 = true;
        for ($i = 0; $i < $size; $i++) {
            if (!$grid[$i][$size - 1 - $i]) {
                $diagonal2 = false;
                break;
            }
        }
        if ($diagonal2) return true;

        // Brak bingo
        return false;
    }



    public function claimWin(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $game = DailyGame::where('date', $today)->first();

        if (!$game) {
            return response()->json(['message' => 'Gra jeszcze nie istnieje'], 404);
        }

        if ($game->winner_user_id) {
            return response()->json([
                'message' => 'Gra została już wygrana',
                'winner_id' => $game->winner_user_id,
            ], 409);
        }

        $card = BingoCard::with('tiles')->where('user_id', $user->id)
            ->where('daily_game_id', $game->id)
            ->first();

        if (!$card) {
            return response()->json(['message' => 'Nie masz planszy na dziś'], 404);
        }

        if (!$this->hasBingo($card)) {
            return response()->json(['message' => 'Nie masz BINGO!'], 422);
        }

        $game->update(['winner_user_id' => $user->id]);

        return response()->json(['message' => 'Gratulacje! Wygrałeś!']);
    }

    public function hasBingoStatus(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $game = DailyGame::where('date', $today)->first();
        if (!$game) {
            return response()->json(['message' => 'Gra nie istnieje'], 404);
        }

        $card = BingoCard::with('tiles')->where('user_id', $user->id)
            ->where('daily_game_id', $game->id)
            ->first();

        if (!$card) {
            return response()->json(['message' => 'Nie masz planszy'], 404);
        }

        $hasBingo = $this->hasBingo($card);

        return response()->json([
            'has_bingo' => $hasBingo,
        ]);
    }


}
