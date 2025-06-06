<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BingoTile extends Model
{
    use HasFactory;

    protected $fillable = [
        'bingo_card_id',
        'row_index',
        'col_index',
        'event_id',
        'marked',
        'marked_at',
    ];

    public function card()
    {
        return $this->belongsTo(BingoCard::class, 'bingo_card_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
