<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index()
    {
        return Event::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'description' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $imageUrl = Storage::url($path); // zwraca np. /storage/events/abc.jpg
        }

        $event = Event::create([
            'description' => $data['description'],
            'image_url' => $imageUrl,
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return $event;
    }

    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'description' => 'sometimes|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image_url && str_starts_with($event->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $event->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('events', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $event->update($data);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        if ($event->image_url && str_starts_with($event->image_url, '/storage/')) {
            $path = str_replace('/storage/', '', $event->image_url);
            Storage::disk('public')->delete($path);
        }

        $event->delete();

        return response()->json(null, 204);
    }
}

