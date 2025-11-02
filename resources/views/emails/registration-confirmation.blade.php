<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Reminder</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #000;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            border-bottom: 2px solid #000;
            padding: 20px 0;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #000;
        }
        .content {
            padding: 0;
        }
        .badge {
            border: 1px solid #000;
            color: #000;
            padding: 6px 12px;
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .today-box {
            border: 2px solid #000;
            padding: 20px;
            margin: 20px 0;
            background: #f5f5f5;
        }
        .today-box h2 {
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        .event-details {
            border: 1px solid #000;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            display: inline-block;
            width: 100px;
        }
        .detail-value {
            display: inline-block;
        }
        .important-note {
            border: 2px solid #000;
            padding: 15px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            margin-top: 20px;
            border: 2px solid #000;
        }
        .checklist {
            border: 1px solid #000;
            padding: 20px;
            margin: 20px 0;
        }
        .checklist h3 {
            margin: 0 0 15px 0;
        }
        .checklist ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .checklist li {
            padding: 8px 0;
        }
        .checklist li:before {
            content: "✓ ";
            font-weight: bold;
            margin-right: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Event Reminder</h1>
    </div>

    <div class="content">
        <div class="badge">Today</div>

        <p>Hi {{ $user->name }},</p>

        <div class="today-box">
            <h2>{{ $event->name }} is TODAY</h2>
            <p style="margin: 0; font-size: 18px;">
                <strong>{{ $event->event_date->format('g:i A') }}</strong>
            </p>
        </div>

        <p>This is your reminder that you're registered for this event happening today.</p>

        <div class="event-details">
            <div class="detail-row">
                <span class="detail-label">Event:</span>
                <span class="detail-value"><strong>{{ $event->name }}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value"><strong>{{ $event->event_date->format('g:i A') }}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ $event->duration }} hour{{ $event->duration > 1 ? 's' : '' }}</span>
            </div>
            @if($event->location)
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">{{ $event->location }}</span>
            </div>
            @endif
            @if($event->address)
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">
                    {{ $event->address }}
                    @if($event->city), {{ $event->city }}@endif
                    @if($event->postal_code) {{ $event->postal_code }}@endif
                </span>
            </div>
            @endif
        </div>

        <div class="important-note">
            <strong>Please arrive 10 minutes early</strong>
        </div>

        <div class="checklist">
            <h3>Before You Go:</h3>
            <ul>
                <li>Check the location and plan your route</li>
                <li>Arrive 10 minutes before the start time</li>
                <li>Bring any necessary materials</li>
            </ul>
        </div>

        <p><strong>Can't make it?</strong> Please cancel your registration as soon as possible.</p>

        <a href="{{ url('/events/' . $event->id) }}" class="button">View Event Details</a>

        <p style="margin-top: 30px;">See you soon.</p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} Event Management System</p>
    </div>
</body>
</html>
