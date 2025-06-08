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

        switch ($type) {
            case 'monthly':
                $start = now()->startOfMonth();
                break;
            case 'weekly':
                $start = now()->startOfWeek();
                break;
            case 'daily':
                $start = now()->startOfDay();
                break;
            case 'all_time':
            default:
                $users = User::orderByDesc('points')->limit($limit)->get();
                return response()->json([
                    'type' => 'all_time',
                    'users' => $users->map(fn($u) => [
                        'id' => $u->id,
                        'name' => $u->name,
                        'points' => $u->points,
                    ]),
                ]);
        }

        $winners = DailyGame::where('winner_user_id', '!=', null)
            ->where('date', '>=', $start)
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
