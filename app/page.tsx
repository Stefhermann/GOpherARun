"use client"; // Mark this component as a Client Component.

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Import the Supabase client.
import { deleteEvent } from "@/app/events/action"; // Import the deleteEvent server action.
import { Event } from "@/types/custom";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]); // State to store events.
  const supabase = createClient(); // Initialize the Supabase client (client-side).

  // Fetch events from the database.
  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error.message);
    } else {
      setEvents(data); // Update the state with the fetched events.
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle delete event.
  const handleDelete = async (id: string) => {
    const result = await deleteEvent(id); // Call the deleteEvent server action.
    if (result.message === "Event deleted successfully!") {
      // Refresh the event list after deletion.
      fetchEvents();
    } else {
      console.error(result.message); // Log the error message.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Gopher Run</h1>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold md:text-5xl">
            Find Your Running Buddy
          </h2>
          <p className="mt-4 text-lg md:text-xl">
            Join running events near you and stay motivated with a group.
          </p>
          <button className="mt-8 rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100">
            Get Started
          </button>
        </div>
      </section>

      {/* Event Feed Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="mb-8 text-2xl font-bold text-gray-800">
          Upcoming Events
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Render events dynamically */}
          {events.map((event) => (
            <div key={event.id} className="rounded-lg bg-white p-6 shadow-md">
              <h4 className="text-xl font-semibold text-gray-800">
                {event.title}
              </h4>
              <p className="mt-2 text-gray-600">{event.location}</p>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(event.time).toLocaleString()}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(event.id)}
                className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Event
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
