"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteEvent } from "@/app/events/actions";
import { Event } from "@/types/custom";
import EventCard from "@/components/Events/event-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Footer from "@/components/Footer/footer";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "joined" | "created">("upcoming");
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);

  console.log(joinedEventIds);
  console.log(activeTab);

  const router = useRouter();

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error.message);
    } else {
      setEvents(data);
    }
  };

  const fetchJoinedEventIds = async (userId: string) => {
    const { data, error } = await supabase
      .from("participants")
      .select("event_id")
      .eq("user_id", userId);
  
    if (error) {
      console.error("Error fetching joined events:", error.message);
      return;
    }
  
    // Extract IDs from the result
    const ids = data.map((entry) => entry.event_id);
    setJoinedEventIds(ids);
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/');
    }
  }, [loading, user]);

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchJoinedEventIds(user.id);
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    const result = await deleteEvent(id);
    if (result.message === "Event deleted successfully!") {
      fetchEvents();
    } else {
      console.error(result.message);
    }
  };

  // Dummy logic for filtering by tab — replace this with real Supabase filters
  const filteredEvents = events.filter(event => {
    if (activeTab === "upcoming") {
      return new Date(event.time) > new Date(); // assuming 'date' field exists
    }
    if (activeTab === "joined") {
      return joinedEventIds.includes(event.id);
    }
    if (activeTab === "created") {
      return event.creator_id === user?.id; // assuming 'creator_id' exists
    }
    return false;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="container mx-auto px-4 py-6">
          {/* Tabs */}
          <div className="flex justify-center mb-4 space-x-4">
            {["upcoming", "joined", "created"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md text-white font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#FFCC33] text-[#5c0013]"
                    : "bg-[#5c0013] text-[#FFCC33] hover:bg-[#7a1a2a]"
                }`}
                onClick={() => setActiveTab(tab as "upcoming" | "joined" | "created")}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              </button>
            ))}
          </div>

          {/* Scrollable Events List */}
          <ScrollArea className="h-[70vh] w-full rounded-lg p-2 bg-[#5c0013]">
            <h3 className="mb-4 text-3xl font-bold text-[#FFCC33] text-center">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Events
            </h3>
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onDelete={handleDelete} />
                ))
              ) : (
                <p className="text-center text-[#FFCC33]">No events to show.</p>
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </section>
      </main>
      <Footer />
    </div>
  );
}
