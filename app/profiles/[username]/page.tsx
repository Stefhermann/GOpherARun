import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EventCard from "@/components/Events/event-card";
import UserEventList from "@/components/Events/UserEventList";
import { Event } from "@/types/custom";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Get the username
  const { username } = await params;

  // Create the supabase server client
  const supabase = await createClient();

  // Get the profile row-data
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single(); // Make sure it's one row

  // Check if the profile exists or if there is an error retrieving the data
  if (!profile || error) {
    notFound();
  }

  // Get the events created by the user (assuming creator_id is the foreign key for the user)
  const { data: events, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("creator_id", profile.id); // Filter based on the logged-in user or the profile's ID

  // Handle event data error
  if (eventError) {
    console.error(eventError);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12 flex justify-center items-start">
      <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-4xl font-bold text-[#7A0019]">
            @{profile.username}
          </h1>
          <p className="text-xl font-medium text-[#7A0019]">
            {profile.first_name} {profile.last_name}
          </p>
        </div>

        {profile.biography && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#7A0019] mb-1">
              Biography
            </h2>
            <p className="text-gray-800">{profile.biography}</p>
          </div>
        )}

        {profile.pronouns && (
          <div className="mt-4">
            <span className="inline-block bg-[#FFCC33] text-[#7A0019] text-sm font-semibold px-3 py-1 rounded-full">
              Pronouns: {profile.pronouns}
            </span>
          </div>
        )}

        {/* Add the User's Created Events */}
        {events && events.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#7A0019] mb-4">Created Events</h2>
            <UserEventList events={events} /> {/* Render events using the client-side component */}
          </div>
        )}
      </div>
    </div>
  );
}
