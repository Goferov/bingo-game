<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Event::class);
        return Event::all();
    }

    public function store(Request $request)
    {

        $this->authorize('create', Event::class);
        $data = $request->validate([
            'description' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $imageUrl = '/storage/'.$path;
        }

        $event = Event::create([
            'description' => $data['description'],
            'image_url' => $imageUrl,
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        $this->authorize('view', $event);
        return $event;
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);
        $data = $request->validate([
            'description' => 'sometimes|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image_url && str_starts_with($event->image_url, '/storage/')) {
                $oldPath = Str::after($event->image_url, '/storage/'); // events/abc.jpg
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('events', 'public');
            $data['image_url'] = '/storage/'.$path;
        }

        $event->update($data);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        if ($event->image_url) {
            $path = parse_url($event->image_url, PHP_URL_PATH) ?? $event->image_url;
            $path = Str::after($path, '/storage/');

            if ($path !== '') {
                Storage::disk('public')->delete($path);
            }
        }

        $event->delete();

        return response()->json(null, 204);
    }
}

