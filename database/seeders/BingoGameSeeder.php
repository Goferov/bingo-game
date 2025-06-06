<?php

namespace Database\Seeders;

use App\Models\BingoCard;
use App\Models\BingoTile;
use App\Models\DailyGame;
use App\Models\Event;
use App\Models\GameSetting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BingoGameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
        ]);

        $users = User::factory(4)->create();

        $events = Event::factory(50)->create();

        GameSetting::create([
            'grid_size' => 5,
            'updated_by_user_id' => $admin->id,
        ]);

        $game = DailyGame::factory()->create([
            'date' => now()->format('Y-m-d'),
        ]);

        foreach ($users as $user) {
            $card = BingoCard::create([
                'user_id' => $user->id,
                'daily_game_id' => $game->id,
            ]);

            $gridSize = 5;
            $selectedEvents = $events->random($gridSize * $gridSize)->values();
            $i = 0;

            for ($row = 0; $row < $gridSize; $row++) {
                for ($col = 0; $col < $gridSize; $col++) {
                    BingoTile::create([
                        'bingo_card_id' => $card->id,
                        'row_index' => $row,
                        'col_index' => $col,
                        'event_id' => $selectedEvents[$i]->id,
                        'marked' => false,
                    ]);
                    $i++;
                }
            }
        }
    }
}
