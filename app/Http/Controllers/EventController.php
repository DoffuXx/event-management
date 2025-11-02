<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class EventController extends Controller
{
    public function index(Request $request)
    {
        try {
            $events = Cache::remember('published_events', 300, function () {
                return Event::published()->orderBy('event_date', 'asc')->get();
            });

            // Cache user registrations (user-specific)
            $userId = $request->user()->id;
            $registeredEventIds = Cache::remember("user_registrations_{$userId}", 300, function () use ($userId) {
                return EventRegistration::where('user_id', $userId)->pluck('event_id')->toArray();
            });

            // Add registration status to events
            $events = $events->map(function ($event) use ($registeredEventIds) {
                $event->is_registered = in_array($event->id, $registeredEventIds);
                return $event;
            });

            return Inertia::render('Dashboard', [
                'events' => $events,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching events: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching events.'], 500);
        }
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);

        $registration = null;
        $isRegistered = false;
        $registrationStatus = null;

        if (auth()->check()) {
            $registration = $event
                ->registrations()
                ->where('user_id', auth()->id())
                ->whereIn('status', ['registered', 'waitlist'])
                ->first();

            if ($registration) {
                $isRegistered = true;
                $registrationStatus = $registration->status;
            }
        }

        return Inertia::render('Events/Show', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'description' => $event->description,
                'event_date' => $event->event_date,
                'duration' => $event->duration,
                'location' => $event->location,
                'address' => $event->address,
                'city' => $event->city,
                'country' => $event->country,
                'postal_code' => $event->postal_code,
                'capacity' => $event->capacity,
                'whitelist_capacity' => $event->whitelist_capacity,
                'status' => $event->status,
                'registered_count' => $event->registeredCount(),
                'waitlist_count' => $event->waitlistCount(),
                'is_registered' => $isRegistered,
                'registration_status' => $registrationStatus,
                'organizer' => $event->organizer ?? null,
                'contact_email' => $event->contact_email ?? null,
            ],
        ]);
    }
}
