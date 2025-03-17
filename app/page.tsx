"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteEvent } from "@/app/events/action";
import { Event } from "@/types/custom";
import NavBar from "@/components/Navigation/nav-bar";
import EventCard from "@/components/Events/event-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const supabase = createClient();

  // Fetch events from the database.
  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error.message);
    } else {
      setEvents(data);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle delete event.
  const handleDelete = async (id: string) => {
    const result = await deleteEvent(id);
    if (result.message === "Event deleted successfully!") {
      fetchEvents();
    } else {
      console.error(result.message);
    }
  };

  return (
    <div className="min-h-screen">

      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 h-96 text-center text-[#7A0019]">
        <div className="absolute inset-0 bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat opacity-30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-4xl font-bold md:text-5xl">Find Your Running Buddy</h2>
          <p className="mt-4 text-lg md:text-xl">
            Join running events near you and stay motivated with a group.
          </p>
          <button className="mt-8 rounded-md bg-[#7A0019] px-6 py-3 text-lg font-semibold text-white hover:bg-[#5c0013]">
            Get Started
          </button>
        </div>
      </section>

      {/* Main Section */}
      <section className="md:grid md:grid-cols-2 md:gap-4">

        {/* Event Feed Section */}
        <section className="container mx-auto px-4 py-4">
          <h3 className="mb-4 text-2xl font-bold text-[#FFCC33] text-center">Upcoming Events</h3>

          {/* Scrollable Vertical Event List */}
          <ScrollArea className="h-96 w-full rounded-lg border p-2 bg-[#5c0013]">
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} onDelete={handleDelete} />
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </section>

        {/* Futre Friends List Section? */}
        <section className="container mx-auto px-4 py-12 text-black">
          <div>
            Hello World
          </div>
        </section>
      </section>
    </div>
  );
}
