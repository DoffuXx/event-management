import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";

export default function Dashboard({ events }) {
    const [dayMaxEvents, setDayMaxEvents] = useState(3); // Default limit

    if (!events) {
        return <div>Loading...</div>;
    }

    // Transform events data for FullCalendar
    const calendarEvents = events.map((event) => {
        // Calculate end date: start date + duration days
        const startDate = new Date(event.event_date);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + (event.duration || 1));

        return {
            id: event.id,
            title: event.name,
            start: event.event_date,
            end: endDate.toISOString().split("T")[0],
            allDay: true,
            backgroundColor: event.is_registered ? "#10b981" : "#3b82f6",
            borderColor: event.is_registered ? "#059669" : "#2563eb",
            extendedProps: {
                city: event.city,
                is_registered: event.is_registered,
                duration: event.duration,
            },
        };
    });

    const handleEventClick = (info) => {
        router.visit(route("events.show", info.event.id));
    };

    const toggleShowMore = () => {
        setDayMaxEvents(dayMaxEvents === 3 ? false : 3);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Event Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl p-6">
                {events.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center shadow">
                        <p className="text-gray-500">No events found.</p>
                    </div>
                ) : (
                    <div className="rounded-lg bg-white p-4 shadow">
                        {/* Header with Legend and Toggle */}
                        <div className="mb-4 flex items-center justify-between">
                            {/* Legend */}
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded bg-blue-500"></div>
                                    <span>Not Registered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded bg-green-500"></div>
                                    <span>Registered</span>
                                </div>
                            </div>

                            {/* Show More Toggle */}
                            <button
                                onClick={toggleShowMore}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                            >
                                {dayMaxEvents === false
                                    ? "Show Less"
                                    : "Show All"}
                            </button>
                        </div>

                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={calendarEvents}
                            eventClick={handleEventClick}
                            headerToolbar={{
                                right: "prev,next today",
                                left: "title",
                            }}
                            height="auto"
                            dayMaxEvents={dayMaxEvents}
                            moreLinkClick="popover"
                            moreLinkText={(num) => `+${num} more`}
                            eventContent={(eventInfo) => (
                                <div className="cursor-pointer p-1">
                                    <div className="truncate text-xs font-semibold">
                                        {eventInfo.event.title}
                                    </div>
                                    <div className="truncate text-xs opacity-75">
                                        {eventInfo.event.extendedProps.city}
                                    </div>
                                    {eventInfo.event.extendedProps
                                        .is_registered && (
                                        <div className="mt-0.5 text-xs font-bold">
                                            ✓ Registered
                                        </div>
                                    )}
                                    {eventInfo.event.extendedProps.duration >
                                        1 && (
                                        <div className="mt-0.5 text-xs opacity-75">
                                            {
                                                eventInfo.event.extendedProps
                                                    .duration
                                            }{" "}
                                            days
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
