<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [['name' => 'Grand Conference Center', 'city' => 'New York', 'state' => 'NY', 'country' => 'USA'], ['name' => 'Tech Hub Arena', 'city' => 'San Francisco', 'state' => 'CA', 'country' => 'USA'], ['name' => 'Convention Palace', 'city' => 'London', 'state' => 'England', 'country' => 'UK'], ['name' => 'Innovation Center', 'city' => 'Berlin', 'state' => 'Berlin', 'country' => 'Germany'], ['name' => 'Business Expo Hall', 'city' => 'Tokyo', 'state' => 'Tokyo', 'country' => 'Japan'], ['name' => 'Summit Meeting Rooms', 'city' => 'Toronto', 'state' => 'ON', 'country' => 'Canada'], ['name' => 'Creative Space', 'city' => 'Sydney', 'state' => 'NSW', 'country' => 'Australia'], ['name' => 'Digital Workshop Center', 'city' => 'Amsterdam', 'state' => 'North Holland', 'country' => 'Netherlands']];

        $eventTypes = ['Tech Conference', 'Business Summit', 'Workshop', 'Networking Event', 'Product Launch', 'Training Session', 'Hackathon', 'Seminar', 'Panel Discussion', 'Meetup'];

        // Durations in minutes: 2 hours to 3 days
        $durations = [
            2,   // 2 hours
            3,   // 3 hours
            4,   // 4 hours
            6,   // 6 hours
            8,   // 8 hours
            12,  // 12 hours
            24,  // 1 day
            48,  // 2 days
            72,  // 3 days
        ];


        // Generate 100 events
        for ($i = 1; $i <= 100; $i++) {
            // Random date within next 30 days
            $daysToAdd = rand(0, 30);
            $hour = rand(8, 18); // 8 AM to 6 PM
            $minute = rand(0, 3) * 15; // 0, 15, 30, 45

            $eventDate = Carbon::now()->addDays($daysToAdd)->setTime($hour, $minute, 0);

            // Random duration
            $duration = $durations[array_rand($durations)];

            // Random location
            $location = $locations[array_rand($locations)];

            // Random event type
            $eventType = $eventTypes[array_rand($eventTypes)];

            // Random capacity
            $capacity = rand(20, 500);
            $whitelistCapacity = rand(5, (int) ($capacity * 0.3));

            // 80% published, 20% draft
            $status = rand(1, 100) <= 80 ? 'published' : 'draft';

            Event::create([
                'name' => "{$eventType} #{$i}",
                'event_date' => $eventDate,
                'duration' => $duration,
                'description' => $this->generateDescription($eventType, $duration),
                'location' => $location['name'],
                'address' => $this->generateAddress(),
                'city' => $location['city'],
                'state' => $location['state'],
                'country' => $location['country'],
                'postal_code' => '12345', // Simplified for seeding
                'capacity' => $capacity,
                'whitelist_capacity' => $whitelistCapacity,
                'status' => $status,
            ]);
        }
    }

    /**
     * Generate event description
     */
    private function generateDescription(string $type, int $duration): string
    {
        $hours = $duration / 60;
        $durationText = $hours < 24 ? round($hours) . ' hour' . ($hours > 1 ? 's' : '') : round($hours / 24) . ' day' . ($hours > 24 ? 's' : '');

        $descriptions = [
            'Tech Conference' => "Join us for an exciting {$durationText} tech conference featuring industry leaders and networking opportunities.",
            'Business Summit' => "A {$durationText} business summit bringing together executives and entrepreneurs.",
            'Workshop' => "Hands-on {$durationText} workshop with practical exercises and expert guidance.",
            'Networking Event' => "Connect with professionals during this {$durationText} networking event.",
            'Product Launch' => "Be among the first to experience our latest innovation at this {$durationText} product launch.",
            'Training Session' => "Comprehensive {$durationText} training session with experienced instructors.",
            'Hackathon' => "Collaborate and innovate during this {$durationText} hackathon with prizes.",
            'Seminar' => "Educational {$durationText} seminar featuring expert speakers and Q&A sessions.",
            'Panel Discussion' => "Thought-provoking {$durationText} panel discussion with industry experts.",
            'Meetup' => "Casual {$durationText} meetup for enthusiasts to share ideas and build community.",
        ];

        return $descriptions[$type] ?? "An engaging {$durationText} event you won't want to miss.";
    }

    /**
     * Generate random street address
     */
    private function generateAddress(): string
    {
        $streets = ['Main St', 'Oak Ave', 'Park Blvd', 'Market St', 'Broadway', 'Washington Ave', 'First Ave', 'King St'];
        return rand(100, 9999) . ' ' . $streets[array_rand($streets)];
    }
}
