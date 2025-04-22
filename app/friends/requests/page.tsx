import SidebarNav from "@/components/Profile/SidebarNavigation";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { AcceptFriendRequestButton } from "@/components/Friends/AcceptFriendRequestButton";
import { DeclineFriendRequestButton } from "@/components/Friends/DeclineFriendRequestButton";

export default async function FriendRequestsPage() {
  const supabase = await createClient();

  // Get current user
  const { data: session, error: authError } = await supabase.auth.getUser();
  const userId = session?.user?.id;

  if (!userId || authError) {
    notFound(); // or redirect to login
  }

  // Step 1: Get all pending friend requests
  const { data: requests, error: requestsError } = await supabase
    .from("friend_requests")
    .select("id, sender_id")
    .eq("receiver_id", userId)
    .eq("status", "pending");

  if (requestsError) {
    console.error("Error fetching friend requests:", requestsError);
    return <div>Error loading friend requests.</div>;
  }

  const senderIds = requests.map(r => r.sender_id);
  if (senderIds.length === 0) {
    return (
      <div className="flex">
        <SidebarNav />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Pending Friend Requests</h1>
          <p>No pending requests.</p>
        </div>
      </div>
    );
  }

  // Step 2: Get profiles of senders
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, first_name, last_name")
    .in("id", senderIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return <div>Error loading profiles.</div>;
  }

  const requestsWithProfiles = requests.map(request => ({
    ...request,
    profile: profiles.find(profile => profile.id === request.sender_id),
  }));

  // Render
  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Friend Requests</h1>
        <ul className="space-y-4">
          {requestsWithProfiles.map((req) => (
            <li
              key={req.id}
              className="p-4 border rounded shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-medium">
                  {req.profile?.first_name ?? "Unknown"} {req.profile?.last_name ?? ""}
                </p>
                <p className="text-gray-600">(@{req.profile?.username})</p>
              </div>
              <div className="space-x-2">
                <AcceptFriendRequestButton senderId={req.sender_id} />
                <DeclineFriendRequestButton senderId={req.sender_id} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
