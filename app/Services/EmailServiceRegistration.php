<?php
namespace App\Services;

use App\Models\{
Event,
User,
EventRegistration
};
use App\Mail\RegistrationConfirmation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailServiceRegistration
{

    public function sendRegistrationConfirmation(string $user_id, string $event_id, string $status)
    {
        try {
            $user = User::findOrFail($user_id);
            $event = Event::findOrFail($event_id);

            Mail::to($user->email)->send(
                    new RegistrationConfirmation($user, $event)
            );
            Log::info("Registration confirmation sent to {$user->email} for event {$event->name}");

            return true;
        } catch (\Exception $e) {
            Log::error("Error sending registration confirmation: " . $e->getMessage());
            return false;
        }
    }
}
