<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bingo_tiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bingo_card_id')->constrained('bingo_cards')->cascadeOnDelete();
            $table->unsignedTinyInteger('row_index');
            $table->unsignedTinyInteger('col_index');
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->boolean('marked')->default(false);
            $table->timestamp('marked_at')->nullable();
            $table->timestamps();

            $table->unique(['bingo_card_id', 'row_index', 'col_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bingo_tiles');
    }
};
