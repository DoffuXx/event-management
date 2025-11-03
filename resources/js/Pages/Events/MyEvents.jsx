import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export default function MyEvents({ events, flash, timezone = "UTC" }) {
    const [deletingId, setDeletingId] = useState(null);

    const userTimezone =
        timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const formatEventDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const zonedDate = toZonedTime(date, userTimezone);
            return format(zonedDate, "MMM dd, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    const formatEventTime = (dateString) => {
        try {
            const date = new Date(dateString);
            const zonedDate = toZonedTime(date, userTimezone);
            return format(zonedDate, "h:mm a");
        } catch (error) {
            return "";
        }
    };

    const handleDelete = (eventId, eventName) => {
        if (
            !confirm(
                `Are you sure you want to delete "${eventName}"? This action cannot be undone.`,
            )
        ) {
            return;
        }

        setDeletingId(eventId);
        router.post(
            route("myeventsDestroy", eventId),
            {},
            {
                onFinish: () => setDeletingId(null),
            },
        );
    };

    const getStatusColor = (status) => {
        return status === "published"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
    };

    const isPastEvent = (eventDate) => {
        return new Date(eventDate) < new Date();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        My Events
                    </h2>
                    <Link
                        href={route("myeventsCreate")}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Create Event
                    </Link>
                </div>
            }
        >
            <Head title="My Events" />

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

                {events.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No events yet
                        </h3>
                        <p className="mt-2 text-gray-500">
                            Get started by creating your first event.
                        </p>
                        <Link
                            href={route("myeventsCreate")}
                            className="mt-4 inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Create Event
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="rounded-lg border border-gray-200 bg-white p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route(
                                                    "myeventsShow",
                                                    event.id,
                                                )}
                                                className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                                            >
                                                {event.name}
                                            </Link>
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(event.status)}`}
                                            >
                                                {event.status}
                                            </span>
                                            {isPastEvent(event.event_date) && (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                    Past Event
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-4">
                                                <span>
                                                    {formatEventDate(
                                                        event.event_date,
                                                    )}
                                                </span>
                                                <span>
                                                    {formatEventTime(
                                                        event.event_date,
                                                    )}
                                                </span>
                                                <span>
                                                    {event.duration} hour
                                                    {event.duration !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span>{event.location}</span>
                                                {event.city && (
                                                    <span>{event.city}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span>
                                                    {event.registered_count ||
                                                        0}
                                                    /{event.capacity} registered
                                                </span>
                                                {event.whitelist_capacity >
                                                    0 && (
                                                    <span>
                                                        {" "}
                                                        {event.waitlist_count ||
                                                            0}
                                                        /
                                                        {
                                                            event.whitelist_capacity
                                                        }{" "}
                                                        waitlisted
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {event.description && (
                                            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="ml-6 flex flex-col gap-2">
                                        <Link
                                            href={route(
                                                "myeventsShow",
                                                event.id,
                                            )}
                                            className="rounded text-center bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={route(
                                                "myeventsEdit",
                                                event.id,
                                            )}
                                            className="rounded text-center bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-200"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    event.id,
                                                    event.name,
                                                )
                                            }
                                            disabled={deletingId === event.id}
                                            className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                                                deletingId === event.id
                                                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                        >
                                            {deletingId === event.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
