"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteEvent } from "@/app/events/action";
import { Event } from "@/types/custom";
import NavBar from "@/components/Navigation/nav-bar";
import EventCard from "@/components/Events/event-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Footer from "@/components/Footer/footer";

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
    <div className="min-h-screen flex flex-col">

      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 h-96 text-center text-[#7A0019] shadow-md">
        <div className="absolute inset-0 -z-10 bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat opacity-30"></div>
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
      <main className="md:grid md:grid-cols-2 md:gap-4 mt-12">


        {/* Futre Friends List Section? */}
        <section className="container mx-auto px-4 text-black">
          <h3 className="text-3xl font-bold text-[#7A0019] text-center mb-6">
            Why Join an Event?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Motivation Block 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">Stay Motivated</h4>
              <p className="text-gray-700 text-center mt-2">
                Running with a group keeps you accountable and makes every run more fun! The energy of a team can push you further than running alone.
              </p>
            </div>

            {/* Motivation Block 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">Make New Friends</h4>
              <p className="text-gray-700 text-center mt-2">
                Meet like-minded people who share your passion for running. Turn workouts into social events and build lasting friendships!
              </p>
            </div>

            {/* Motivation Block 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">Improve Your Health</h4>
              <p className="text-gray-700 text-center mt-2">
                Regular running boosts heart health, reduces stress, and keeps you fit. Joining an event helps you stay consistent and reach your goals.
              </p>
            </div>

            {/* Motivation Block 4 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">Have Fun & Celebrate</h4>
              <p className="text-gray-700 text-center mt-2">
                Running isn’t just about fitness; it’s about having fun! Enjoy the journey, set new challenges, and celebrate every milestone.
              </p>
            </div>
          </div>
        </section>

        {/* Event Feed Section */}
        <section className="container mx-auto px-4">
          <h3 className="mb-4 text-3xl font-bold text-[#FFCC33] text-center">Upcoming Events</h3>

          {/* Scrollable Vertical Event List */}
          <ScrollArea className="h-96 w-full rounded-lg p-2 bg-[#5c0013]">
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} onDelete={handleDelete} />
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </section>
      </main>
      <Footer />
    </div>
  );
}
