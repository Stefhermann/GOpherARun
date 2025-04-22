import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import UserEventList from "@/components/Events/UserEventList";
import { Event } from "@/types/custom";
import { SendFriendRequestButton } from "@/components/Friends/SendFriendRequestButton";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Get the username
  const { username } = await params;

  // Create the supabase server client
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  console.log("current user: ", user.user.id);

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

  const { data: friendship, error: friendshipError } = await supabase 
    .from("friends")
    .select("*")
    .eq("user_initiator", user.user.id)
    .eq("user_friend", profile.id)

  console.log("friendship: ", friendship);

  const { data: request, error: requestError } = await supabase
  .from("friend_requests")
  .select("*")
  .eq("sender_id", user.user.id)     // the current logged-in user
  .eq("receiver_id", profile.id)   // the user whose profile you're viewing

  console.log("request: ", request);

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
      <div className="mb-6 border-b border-gray-300 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#7A0019]">
            @{profile.username}
          </h1>
          <p className="text-xl font-medium text-[#7A0019]">
            {profile.first_name} {profile.last_name}
          </p>
        </div>
        {friendship?.length === 1 ? (
          <p>Friends</p>
        ) : request?.length === 1 ? (
          <p>Pending...</p>
        ) : (
          <SendFriendRequestButton receiverId={profile.id} />
        )}
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
