<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use App\Models\Event;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventReminderNotification extends Notification
{
    use Queueable;
    protected $event;

    /**
     * Create a new notification instance.
     */
    public function __construct(Event $event)
    {
       $this->event = $event;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reminder: ' . $this->event->title . ' Today!')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a friendly reminder that you are registered for:')
            ->line('**' . $this->event->title . '**')
            ->line('Date: ' . $this->event->event_date->format('F j, Y'))
            ->line('Time: ' . $this->event->event_date->format('g:i A'))
            ->line('Duration: ' . $this->event->duration . ' hour(s)')
            ->when($this->event->location, function ($mail) {
                return $mail->line('Location: ' . $this->event->location);
            })
            ->action('View Event Details', route('events.show', $this->event->id))
            ->line('We look forward to seeing you there!');

    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'event_id' => $this->event->id,
            'event_title' => $this->event->title,
            'event_date' => $this->event->event_date,
            'message' => 'Reminder: ' . $this->event->title . ' is today at ' . $this->event->event_date->format('g:i A')
        ];
    }
}
