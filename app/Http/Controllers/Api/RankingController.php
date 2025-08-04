<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyGame;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'all_time');
        $limit = $request->query('limit', 10);

        $start = match ($type) {
            'monthly' => now()->startOfMonth(),
            'weekly'  => now()->startOfWeek(),
            'daily'   => now()->startOfDay(),
            default   => null,
        };

        $query = DailyGame::whereNotNull('winner_user_id');

        if ($start) {
            $query->where('date', '>=', $start);
        }

        $winners = $query
            ->select('winner_user_id', DB::raw('count(*) as wins'))
            ->groupBy('winner_user_id')
            ->orderByDesc('wins')
            ->limit($limit)
            ->get();

        $users = User::whereIn('id', $winners->pluck('winner_user_id'))->get()->keyBy('id');

        return response()->json([
            'type' => $type,
            'users' => $winners->map(function ($row) use ($users) {
                $user = $users[$row->winner_user_id] ?? null;
                return [
                    'id' => $user?->id,
                    'name' => $user?->name ?? 'Unknown',
                    'wins' => $row->wins,
                ];
            }),
        ]);
    }
}
