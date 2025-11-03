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
            $registeredEventIds = EventRegistration::where('user_id', $userId)->where('status', '!=', 'cancelled')->pluck('event_id')->toArray();

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

    public function myeventsListing(Request $request)
    {
        try {
        $userId = $request->user()->id;


        $events = Event::where('user_id', $userId)
            ->orderBy('event_date', 'asc')
            ->paginate(5)
            ->withQueryString();



        return Inertia::render('Events/MyEvents', [
            'events' => $events,
        ]);
        } catch (\Exception $e) {
            return redirect()
                ->route('dashboard')
                ->with('error', 'Failed to load your events: ' . $e->getMessage());
        }
    }

    public function myeventsShow($id)
    {
        $event = Event::findOrFail($id);

        return Inertia::render('Events/MyEventDetail', [
            'event' => $event,
        ]);
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function edit($id)
    {
        try {
            $userId = auth()->id();

            $event = Event::where('id', $id)->where('user_id', $userId)->firstOrFail();

            if (!$event) {
                return redirect()->route('myeventsListing')->with('error', 'Event not found or you do not have permission to edit this event.');
            }

            return Inertia::render('Events/Edit', [
                'event' => $event,
            ]);
        } catch (\Exception $e) {
            return redirect()
                ->route('myeventsListing')
                ->with('error', 'Failed to load event for editing: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $userId = auth()->id();
            $event = Event::where('id', $id)->where('user_id', $userId)->firstOrFail();

            $event->delete();

            return redirect()->route('events.myevents')->with('success', 'Event deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->route('events.myevents')
                ->with('error', 'Failed to delete event: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'event_date' => 'required|date',
                'duration' => 'required|integer|min:1',
                'description' => 'nullable|string',
                'location' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:20',
                'capacity' => 'required|integer|min:1',
                'whitelist_capacity' => 'required|integer|min:0',
                'status' => 'required|in:published,draft',
            ]);

            Event::create(array_merge($validatedData, ['user_id' => $request->user()->id]));

            return redirect()->route('myeventsListing')->with('success', 'Event created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->route('myeventsCreate')
                ->with('error', 'Failed to create event: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'event_date' => 'required|date',
                'duration' => 'required|integer|min:1',
                'description' => 'nullable|string',
                'location' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:20',
                'capacity' => 'required|integer|min:1',
                'whitelist_capacity' => 'required|integer|min:0',
                'status' => 'required|in:published,draft',
            ]);

            Event::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->update($validatedData);

            return redirect()->route('myeventsListing')->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->route('myeventsEdit', ['id' => $id])
                ->with('error', 'Failed to update event: ' . $e->getMessage());
        }
    }
}
