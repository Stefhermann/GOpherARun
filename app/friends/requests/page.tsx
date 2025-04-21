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

  // Get friend requests where current user is the receiver and status is pending
  const { data: requests, error } = await supabase
    .from("friend_requests")
    .select("id, sender_id")
    .eq("receiver_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    return <div>Error loading friend requests.</div>;
  }

  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Friend Requests</h1>
        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li
                key={req.id}
                className="p-4 border rounded shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-lg font-medium">
                    {req.id} {req.sender_id}
                  </p>
                  <p className="text-gray-600">@{req.sender_id}</p>
                </div>
                {/* Placeholder for Accept/Decline actions */}
                <div className="space-x-2">
                  <AcceptFriendRequestButton senderId={req.sender_id}/>
                  <DeclineFriendRequestButton senderId={req.sender_id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
