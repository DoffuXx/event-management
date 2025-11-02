<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Event;

class CheckEventCapacity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $eventId = $request->route('eventId') ?? $request->route('event');
        if (!$eventId) {
            return redirect()->back()->with('error', 'Invalid event ID.');
        }
        try {
            $event = Event::findOrFail($eventId);

            // Block registration only if full AND no waitlist
            if (!$event->hasCapacity()) {
                if (!$event->hasWhitelistCapacity()) {
                return redirect()->back()
                    ->with('error', 'This event is full and does not have a waitlist.');
                }
            }

            return $next($request);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Event not found.');
        }
        return $next($request);
    }
}
