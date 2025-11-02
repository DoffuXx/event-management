<?php

namespace App\Http\Controllers;

use App\Services\EventRegistrationService;
use Illuminate\Http\Request;

class EventRegistrationController extends Controller
{
    protected $eventRegistrationService;

    public function __construct(EventRegistrationService $eventRegistrationService)
    {
        $this->eventRegistrationService = $eventRegistrationService;
    }

    public function store(Request $request, $eventId)
    {
        if (!$request->user()) {
            return redirect()->route('login')->with('error', 'You must be logged in to register for an event.');
        }
        if (!$eventId || !is_numeric($eventId)) {
            return redirect()->back()->with('error', 'Invalid event ID.');
        }

        try {
            $event = \App\Models\Event::findOrFail($eventId);
            $userId = $request->user()->id;

               // Check if event is published
            if ($event->status !== 'published') {
                return redirect()->route('events.show', $eventId)
                    ->with('error', 'This event is not open for registration.');
            }

            // Check if user is already registered
            if ($this->eventRegistrationService->isUserRegistered($eventId, $userId)) {
                return redirect()->route('events.show', $eventId)
                    ->with('error', 'You are already registered for this event.');
            }

            // Check for overlapping events
            if ($this->eventRegistrationService->hasOverlappingRegistrations($userId, $event->event_date, $event->duration, $eventId)) {
                return redirect()->route('events.show', $eventId)
                    ->with('error', 'You have another event scheduled at the same time.');
            }

                        $result = $this->eventRegistrationService->registerUser($eventId, $userId);

            $message = $result['status'] === 'registered'
                ? 'Successfully registered for the event!'
                : 'Event is full. You have been added to the waitlist.';

                        return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

        public function destroy(Request $request, $eventId)
    {
        if (!$request->user()) {
            return redirect()->route('login')->with('error', 'You must be logged in.');
        }

        if (!$eventId || !is_numeric($eventId)) {
            return redirect()->back()->with('error', 'Invalid event ID.');
        }

        try {
            $userId = $request->user()->id;

            // Check if user is registered
            if (!$this->eventRegistrationService->isUserRegistered($eventId, $userId)) {
                return redirect()->back()->with('error', 'You are not registered for this event.');
            }

            $this->eventRegistrationService->cancelRegistration($eventId, $userId);

            return redirect()->route('events.show', $eventId)
                ->with('success', 'Your registration has been cancelled successfully.');

        } catch (\Exception $e) {
            \Log::error('Cancellation error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while cancelling your registration. Please try again.');
        }
    }

}
