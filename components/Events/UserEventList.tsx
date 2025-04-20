"use client";

import EventCard from "@/components/Events/event-card";
import { Event } from "@/types/custom";

export default function UserEventList({ events }: { events: Event[] }) {
  return (
    <div className="mt-8 space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDelete={() => {}} />
      ))}
    </div>
  );
}
