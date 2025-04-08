"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteEvent } from "@/app/events/actions";
import { Event } from "@/types/custom";
import EventCard from "@/components/Events/event-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Footer from "@/components/Footer/footer";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; 

export default function Home() {
  
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);
  
  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user]);

  const supabase = createClient();



  const [events, setEvents] = useState<Event[]>([]);

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
      {/* Event Feed Section */}
      <main className="flex-1">
        <section className="container max-h-[75%] mx-auto px-4">
          {/* Scrollable Vertical Event List */}
          <ScrollArea className="h-full w-full rounded-lg p-2 bg-[#5c0013]">
            <h3 className="mb-4 text-3xl font-bold text-[#FFCC33] text-center">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDelete={handleDelete}
                />
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