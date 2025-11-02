<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Log;
use App\Notifications\EventReminderNotification;
use Carbon\Carbon;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hoursBeforeEvent = 2;
        $now = Carbon::now();

        // Get events happening within the specified time window
        $targetTime = $now->copy()->addHours($hoursBeforeEvent);

        $events = Event::where('status', 'published')
            ->whereDate('event_date', $now->toDateString())
            ->whereBetween('event_date', [$now, $targetTime])
            ->get();

        if ($events->isEmpty()) {
            $this->info('No events found requiring reminders.');
            Log::info('Event reminders: No events found');
            return 0;
        }

        $totalNotificationsSent = 0;

        foreach ($events as $event) {
            $registrations = EventRegistration::where('event_id', $event->id)->where('status', 'registered')->with('user')->get();

            foreach ($registrations as $registration) {
                try {
                    $registration->user->notify(new EventReminderNotification($event));
                    $totalNotificationsSent++;
                } catch (\Exception $e) {
                    Log::error("Failed to send reminder for event {$event->id} to user {$registration->user_id}: " . $e->getMessage());
                    $this->error("Failed to notify user {$registration->user->email} for event: {$event->title}");
                }
            }

            $this->info("Sent {$registrations->count()} reminders for event: {$event->title}");
        }

        $this->info("Total reminders sent: {$totalNotificationsSent}");
        Log::info("Event reminders sent: {$totalNotificationsSent} notifications for {$events->count()} events");

        return 0;
    }
}
