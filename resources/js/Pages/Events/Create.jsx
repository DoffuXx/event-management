import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        event_date: "",
        duration: 1,
        description: "",
        location: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        capacity: "",
        whitelist_capacity: 0,
        status: "draft",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("myeventsStore"));
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        return new Date(dateTimeStr).toISOString().slice(0, 16);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Create New Event
                    </h2>
                    <Link
                        href={route("myeventsListing")}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                        Back to Events
                    </Link>
                </div>
            }
        >
            <Head title="Create Event" />

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Flash Messages */}
                {flash?.error && (
                    <div className="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4">
                        <p className="text-sm text-red-800">{flash.error}</p>
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
                                    Maximum number of people who can attend
                                </p>
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
                                    Maximum waitlist size (0 for no waitlist)
                                </p>
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
                            href={route("myeventsListing")}
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
                            {processing ? "Creating..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
