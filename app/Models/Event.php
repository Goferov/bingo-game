<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'image_url',
        'enabled',
    ];

    public function tiles()
    {
        return $this->hasMany(BingoTile::class);
    }
}
