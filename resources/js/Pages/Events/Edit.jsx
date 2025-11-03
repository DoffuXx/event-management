import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ event, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: event.name || "",
        event_date: event.event_date || "",
        duration: event.duration || 1,
        description: event.description || "",
        location: event.location || "",
        address: event.address || "",
        city: event.city || "",
        state: event.state || "",
        country: event.country || "",
        postal_code: event.postal_code || "",
        capacity: event.capacity || "",
        whitelist_capacity: event.whitelist_capacity || 0,
        status: event.status || "draft",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("myeventsUpdate", event.id));
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        // Convert to local datetime format for input
        const date = new Date(dateTimeStr);
        return date.toISOString().slice(0, 16);
    };

    // Check if event has registrations
    const hasRegistrations =
        event.registered_count > 0 || event.waitlist_count > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Edit Event: {event.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route("myeventsShow", event.id)}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                        >
                            View Event
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
            <Head title={`Edit Event: ${event.name}`} />

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Flash Messages */}
                {flash?.error && (
                    <div className="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4">
                        <p className="text-sm text-red-800">{flash.error}</p>
                    </div>
                )}

                {/* Warning for events with registrations */}
                {hasRegistrations && (
                    <div className="mb-6 rounded border-l-4 border-yellow-500 bg-yellow-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Warning:</strong> This event has{" "}
                                    {event.registered_count || 0} registered
                                    attendees
                                    {event.waitlist_count > 0 &&
                                        ` and ${event.waitlist_count} people on the waitlist`}
                                    . Changes to capacity or event details may
                                    affect existing registrations.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            Event Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Event Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.name
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter event name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Event Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Event Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formatDateTime(data.event_date)}
                                    onChange={(e) =>
                                        setData("event_date", e.target.value)
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.event_date
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.event_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.event_date}
                                    </p>
                                )}
                                {hasRegistrations && (
                                    <p className="mt-1 text-xs text-yellow-600">
                                        ⚠️ Changing the date/time will affect{" "}
                                        {event.registered_count} registered
                                        attendees
                                    </p>
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Duration (hours) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.duration}
                                    onChange={(e) =>
                                        setData(
                                            "duration",
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.duration
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.description
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Describe your event..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            Location Details
                        </h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Location Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Venue/Location Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.location
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="e.g., Community Center, Park Pavilion"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.location}
                                    </p>
                                )}
                                {hasRegistrations && (
                                    <p className="mt-1 text-xs text-yellow-600">
                                        ⚠️ Changing the location will affect
                                        registered attendees
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    placeholder="123 Main Street"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    value={data.state}
                                    onChange={(e) =>
                                        setData("state", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData("postal_code", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capacity Settings */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            Capacity Settings
                        </h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Main Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Event Capacity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.capacity}
                                    onChange={(e) =>
                                        setData(
                                            "capacity",
                                            parseInt(e.target.value) || "",
                                        )
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.capacity
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Maximum attendees"
                                />
                                {errors.capacity && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.capacity}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Current registrations:{" "}
                                    {event.registered_count || 0}
                                </p>
                                {hasRegistrations &&
                                    data.capacity < event.registered_count && (
                                        <p className="mt-1 text-xs text-red-600">
                                            ⚠️ Warning: New capacity is less
                                            than current registrations!
                                        </p>
                                    )}
                            </div>

                            {/* Waitlist Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Waitlist Capacity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.whitelist_capacity}
                                    onChange={(e) =>
                                        setData(
                                            "whitelist_capacity",
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                                        errors.whitelist_capacity
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="0"
                                />
                                {errors.whitelist_capacity && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.whitelist_capacity}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Current waitlist:{" "}
                                    {event.waitlist_count || 0}
                                </p>
                                {hasRegistrations &&
                                    data.whitelist_capacity <
                                        event.waitlist_count && (
                                        <p className="mt-1 text-xs text-red-600">
                                            ⚠️ Warning: New waitlist capacity is
                                            less than current waitlist!
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Publication Settings */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            Publication Status
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        checked={data.status === "draft"}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Save as Draft
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="published"
                                        checked={data.status === "published"}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Publish Event
                                    </span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Draft events are only visible to you. Published
                                events are visible to all users.
                            </p>
                            {hasRegistrations &&
                                data.status === "draft" &&
                                event.status === "published" && (
                                    <p className="text-xs text-yellow-600">
                                        ⚠️ Changing to draft will hide this
                                        event from registered users
                                    </p>
                                )}
                            {errors.status && (
                                <p className="text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-6">
                        <Link
                            href={route("myeventsShow", event.id)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-6 py-2 text-sm font-medium text-white transition ${
                                processing
                                    ? "cursor-not-allowed bg-gray-400"
                                    : "bg-gray-900 hover:bg-gray-800"
                            }`}
                        >
                            {processing ? "Updating..." : "Update Event"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
