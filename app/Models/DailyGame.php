<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyGame extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'winner_user_id',
    ];

    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_user_id');
    }

    public function cards()
    {
        return $this->hasMany(BingoCard::class);
    }
}
