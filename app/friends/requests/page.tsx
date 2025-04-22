import SidebarNav from "@/components/Profile/SidebarNavigation";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import FriendRequestList from "@/components/Friends/FriendRequestList";
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
      <FriendRequestList requestsWithProfiles={requestsWithProfiles} />
    </div>
  );
}
