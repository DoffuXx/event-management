import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export default function Show({ event, timezone = "UTC", flash }) {
    const [joining, setJoining] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    // Get user's timezone
    const userTimezone =
        timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    // Format event date with timezone
    const formatEventDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const zonedDate = toZonedTime(date, userTimezone);
            return format(zonedDate, "EEEE, MMMM dd, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    const formatEventTime = (dateString) => {
        try {
            const date = new Date(dateString);
            const zonedDate = toZonedTime(date, userTimezone);
            return format(zonedDate, "h:mm a zzz");
        } catch (error) {
            return "";
        }
    };

    const handleJoinEvent = async () => {
        if (joining || event.is_registered) return;

        setJoining(true);

        router.post(
            route("events.join", event.id),
            {},
            {
                preserveScroll: false,
                onFinish: () => {
                    setJoining(false);
                },
            },
        );
    };

    const handleCancelRegistration = async () => {
        if (cancelling || !event.is_registered) return;

        const confirmMessage =
            event.registration_status === "registered"
                ? "Are you sure you want to cancel your registration? Your spot will be given to the next person on the waitlist."
                : "Are you sure you want to remove yourself from the waitlist?";

        if (!confirm(confirmMessage)) {
            return;
        }

        setCancelling(true);

        router.post(
            route("events.cancel", event.id),
            {},
            {
                preserveScroll: false,
                onFinish: () => {
                    setCancelling(false);
                },
            },
        );
    };

    // Calculate capacity percentage
    const capacityPercentage = event.capacity
        ? Math.min((event.registered_count / event.capacity) * 100, 100)
        : 0;

    const isFull = event.capacity && event.registered_count >= event.capacity;

    // Check if whitelist is full
    const whitelistPercentage = event.whitelist_capacity
        ? Math.min((event.waitlist_count / event.whitelist_capacity) * 100, 100)
        : 0;

    const isWhitelistFull =
        event.whitelist_capacity &&
        event.waitlist_count >= event.whitelist_capacity;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Event Details
                    </h2>
                    <Link
                        href={route("dashboard")}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                        Back
                    </Link>
                </div>
            }
        >
            <Head title={event.name} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 rounded border-l-4 border-green-500 bg-green-50 p-4">
                        <p className="text-sm text-green-800">
                            {flash.success}
                        </p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4">
                        <p className="text-sm text-red-800">{flash.error}</p>
                    </div>
                )}

                {/* Main Event Card */}
                <div className="rounded-lg border border-gray-200 bg-white">
                    {/* Event Header */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {event.name}
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    {formatEventDate(event.event_date)}
                                </p>
                                {event.event_date && (
                                    <p className="text-sm text-gray-500">
                                        {formatEventTime(event.event_date)}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Duration: {event.duration} hour
                                    {event.duration !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Registration Status Badge */}
                            {event.is_registered && (
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        event.registration_status === "waitlist"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    {event.registration_status === "waitlist"
                                        ? "Waitlisted"
                                        : "Registered"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                        {/* Location & Capacity */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Location
                                </p>
                                <p className="mt-1 text-gray-900">
                                    {event.location}
                                </p>
                                {event.city && (
                                    <p className="text-sm text-gray-600">
                                        {event.city}
                                    </p>
                                )}
                            </div>

                            {/* Main Capacity */}
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Capacity
                                </p>
                                <p className="mt-1 text-gray-900">
                                    {event.registered_count || 0}
                                    {event.capacity &&
                                        ` / ${event.capacity}`}{" "}
                                    attendees
                                </p>
                                {event.capacity && (
                                    <div className="mt-2">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full ${
                                                    capacityPercentage >= 100
                                                        ? "bg-red-500"
                                                        : capacityPercentage >=
                                                            80
                                                          ? "bg-yellow-500"
                                                          : "bg-green-600"
                                                }`}
                                                style={{
                                                    width: `${capacityPercentage}%`,
                                                }}
                                            />
                                        </div>
                                        {isFull && !event.is_registered && (
                                            <p className="mt-1 text-xs text-red-600">
                                                Main capacity full
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Waitlist Capacity */}
                            {event.whitelist_capacity && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Waitlist
                                    </p>
                                    <p className="mt-1 text-gray-900">
                                        {event.waitlist_count || 0} /{" "}
                                        {event.whitelist_capacity} people
                                    </p>
                                    <div className="mt-2">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full ${
                                                    whitelistPercentage >= 100
                                                        ? "bg-red-500"
                                                        : whitelistPercentage >=
                                                            80
                                                          ? "bg-yellow-500"
                                                          : "bg-blue-600"
                                                }`}
                                                style={{
                                                    width: `${whitelistPercentage}%`,
                                                }}
                                            />
                                        </div>
                                        {isWhitelistFull &&
                                            !event.is_registered && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    Waitlist also full
                                                </p>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    About
                                </p>
                                <p className="mt-2 whitespace-pre-line text-gray-700">
                                    {event.description}
                                </p>
                            </div>
                        )}

                        {/* Organizer Info */}
                        {(event.organizer || event.contact_email) && (
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Organizer
                                </p>
                                <div className="mt-2 space-y-1 text-sm">
                                    {event.organizer && (
                                        <p className="text-gray-900">
                                            {event.organizer}
                                        </p>
                                    )}
                                    {event.contact_email && (
                                        <a
                                            href={`mailto:${event.contact_email}`}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            {event.contact_email}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <div className="flex items-center justify-between gap-4">
                            <Link
                                href={route("dashboard")}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                ← All events
                            </Link>

                            {event.is_registered ? (
                                <button
                                    onClick={handleCancelRegistration}
                                    disabled={cancelling}
                                    className={`rounded px-6 py-2 text-sm font-medium text-white transition ${
                                        cancelling
                                            ? "cursor-not-allowed bg-gray-400"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    {cancelling
                                        ? "Cancelling..."
                                        : "Cancel Registration"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoinEvent}
                                    disabled={
                                        joining || (isFull && isWhitelistFull)
                                    }
                                    className={`rounded px-6 py-2 text-sm font-medium text-white transition ${
                                        joining || (isFull && isWhitelistFull)
                                            ? "cursor-not-allowed bg-gray-400"
                                            : isFull
                                              ? "bg-yellow-600 hover:bg-yellow-700"
                                              : "bg-gray-900 hover:bg-gray-800"
                                    }`}
                                >
                                    {joining
                                        ? "Joining..."
                                        : isFull && isWhitelistFull
                                          ? "Event Full"
                                          : isFull
                                            ? "Join Waitlist"
                                            : "Register"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Waitlist Info */}
                {event.is_registered &&
                    event.registration_status === "waitlist" && (
                        <div className="mt-4 rounded border-l-4 border-yellow-500 bg-yellow-50 p-4">
                            <p className="text-sm text-yellow-800">
                                <span className="font-medium">
                                    You're on the waitlist
                                </span>
                                <br />
                                You'll be automatically registered if a spot
                                becomes available. You'll receive an email
                                notification when you're promoted.
                            </p>
                        </div>
                    )}

                {/* Event Full Warning */}
                {!event.is_registered && isFull && isWhitelistFull && (
                    <div className="mt-4 rounded border-l-4 border-red-500 bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                            <span className="font-medium">
                                Event is completely full
                            </span>
                            <br />
                            Both the main event capacity and waitlist are full.
                            Registration is currently unavailable.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
