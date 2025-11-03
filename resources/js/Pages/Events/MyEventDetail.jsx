import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export default function MyEventDetail({
    event,
    registrations = [],
    timezone = "UTC",
    flash,
}) {
    const [deletingId, setDeletingId] = useState(null);

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

    const handleDelete = () => {
        if (
            !confirm(
                `Are you sure you want to delete "${event.name}"? This action cannot be undone and will cancel all registrations.`,
            )
        ) {
            return;
        }

        setDeletingId(event.id);
        router.post(
            route("myeventsDestroy", event.id),
            {},
            {
                onFinish: () => setDeletingId(null),
            },
        );
    };

    // Calculate capacity percentages
    const capacityPercentage = event.capacity
        ? Math.min((event.registered_count / event.capacity) * 100, 100)
        : 0;

    const whitelistPercentage = event.whitelist_capacity
        ? Math.min((event.waitlist_count / event.whitelist_capacity) * 100, 100)
        : 0;

    const isPastEvent = new Date(event.event_date) < new Date();

    // Separate registered and waitlisted users
    const registeredUsers = registrations.filter(
        (reg) => reg.status === "registered",
    );
    const waitlistedUsers = registrations.filter(
        (reg) => reg.status === "waitlist",
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        My Event Details
                    </h2>
                    <div className="flex gap-2">
                        {event.status === "published" && (
                            <Link
                                href={route("events.show", event.id)}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                Public Event Link
                            </Link>
                        )}

                        <Link
                            href={route("myeventsEdit", event.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Edit Event
                        </Link>
                        <Link
                            href={route("myeventsListing")}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                        >
                            Back to Events
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`My Event: ${event.name}`} />

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

                {/* Event Header */}
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {event.name}
                                    </h1>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            event.status === "published"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {event.status}
                                    </span>
                                    {isPastEvent && (
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                            Past Event
                                        </span>
                                    )}
                                </div>
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
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 space-y-4">
                        {/* Location */}
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Location
                            </p>
                            <p className="mt-1 text-gray-900">
                                {event.location}
                            </p>
                            {event.address && (
                                <p className="text-sm text-gray-600">
                                    {event.address}
                                </p>
                            )}
                            {event.city && (
                                <p className="text-sm text-gray-600">
                                    {event.city}
                                    {event.state && `, ${event.state}`}
                                    {event.country && `, ${event.country}`}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Description
                                </p>
                                <p className="mt-2 whitespace-pre-line text-gray-700">
                                    {event.description}
                                </p>
                            </div>
                        )}

                        {/* Capacity Overview */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Main Capacity */}
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Main Capacity
                                </p>
                                <p className="mt-1 text-gray-900">
                                    {event.registered_count || 0} /{" "}
                                    {event.capacity} attendees
                                </p>
                                <div className="mt-2">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className={`h-full ${
                                                capacityPercentage >= 100
                                                    ? "bg-red-500"
                                                    : capacityPercentage >= 80
                                                      ? "bg-yellow-500"
                                                      : "bg-green-600"
                                            }`}
                                            style={{
                                                width: `${capacityPercentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Waitlist */}
                            {event.whitelist_capacity > 0 && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Waitlist
                                    </p>
                                    <p className="mt-1 text-gray-900">
                                        {event.waitlist_count || 0} /{" "}
                                        {event.whitelist_capacity} people
                                    </p>
                                    <div className="mt-2">
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
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
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
