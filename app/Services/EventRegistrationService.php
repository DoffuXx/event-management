<?php
namespace App\Services;

use App\Models\{Event, EventRegistration};
use Illuminate\Support\Facades\DB;
use App\Services\EmailServiceRegistration;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class EventRegistrationService
{

    protected $emailService;

    public function __construct(EmailServiceRegistration $emailService)
    {
        $this->emailService = $emailService;
    }

    public function isUserRegistered($eventId, $userId)
    {
        return EventRegistration::where('event_id', $eventId)->where('user_id', $userId)->where('status', 'registered')->exists();
    }


     public function hasOverlappingRegistrations($userId, $eventDate, $duration, $excludeEventId = null)
    {
        // Calculate the datetime range for the new event (duration is in hours)
        $newEventStart = Carbon::parse($eventDate);
        $newEventEnd = Carbon::parse($eventDate)->addHours($duration);

        $overlappingEvents = Event::whereHas('registrations', function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->where('status', 'registered');
        })
        ->when($excludeEventId, function ($query) use ($excludeEventId) {
            $query->where('id', '!=', $excludeEventId);
        })
        ->get()
        ->filter(function ($event) use ($newEventStart, $newEventEnd) {
            $existingEventStart = Carbon::parse($event->event_date);
            $existingEventEnd = Carbon::parse($event->event_date)->addHours($event->duration);

            return $newEventStart->lt($existingEventEnd) &&
                   $existingEventStart->lt($newEventEnd);
        });

        return $overlappingEvents->count() > 0;
    }

        public function registerUser($eventId, $userId)
    {
        try {
            $event = Event::findOrFail($eventId);

            if ($event->hasCapacity()) {
              $status = 'registered';
               } elseif ($event->hasWhitelistCapacity()) {
                 $status = 'waitlist';
              } else {
                 throw Exception;
            }

            DB::beginTransaction();

            $registration = EventRegistration::create([
                'event_id' => $eventId,
                'user_id' => $userId,
                'status' => $status,
                'registered_at' => now(),
            ]);

            if ($status === 'registered') {
                $this->emailService->sendRegistrationConfirmation($userId, $eventId, $status);
            }

            DB::commit();

            return [
                'registration' => $registration,
                'status' => $status
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error registering user: ' . $e->getMessage());
            throw $e;
        }
    }
       public function cancelRegistration($eventId, $userId)
    {
        try {
            DB::beginTransaction();

            $registration = EventRegistration::where('event_id', $eventId)
                ->where('user_id', $userId)
                ->whereIn('status', ['registered', 'waitlist'])
                ->firstOrFail();

            $wasConfirmed = $registration->status === 'registered';

            $registration->update(['status' => 'cancelled']);

            if ($wasConfirmed) {
                $this->promoteFromWaitlist($eventId);
            }

            DB::commit();

            Log::info("User {$userId} cancelled registration for event {$eventId}");

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error cancelling registration: ' . $e->getMessage());
            throw $e;
        }
    }

    protected function promoteFromWaitlist($eventId)
    {
        try {
            $event = Event::findOrFail($eventId);

            if (!$event->hasCapacity() || $event->waitlistCount() === 0) {
                return false;
            }

            $waitlistRegistration = EventRegistration::where('event_id', $eventId)
                ->where('status', 'waitlist')
                ->orderBy('registered_at', 'asc')
                ->first();
            if (!$waitlistRegistration) {
                return false;
            }

            $userId = $waitlistRegistration->user_id;

            $status = 'registered';


            $waitlistRegistration->update([
                'status' => 'registered'
            ]);

            $this->emailService->sendRegistrationConfirmation($userId, $eventId, $status);


            return true;
        } catch (\Exception $e) {
            Log::error('Error promoting from waitlist: ' . $e->getMessage());
            return false;
        }
    }

}
