<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BingoCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'daily_game_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(DailyGame::class, 'daily_game_id');
    }

    public function tiles()
    {
        return $this->hasMany(BingoTile::class);
    }
}
