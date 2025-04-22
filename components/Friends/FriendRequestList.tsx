"use client";

import { useState } from "react";
import SidebarNav from "@/components/Profile/SidebarNavigation";
import { AcceptFriendRequestButton } from "@/components/Friends/AcceptFriendRequestButton";
import { DeclineFriendRequestButton } from "@/components/Friends/DeclineFriendRequestButton";

export default function FriendRequestList({ requestsWithProfiles }) {
  const [requests, setRequests] = useState(requestsWithProfiles);

  const removeRequest = (senderId: string) => {
    setRequests((prev) => prev.filter((req) => req.sender_id !== senderId));
  };

  return (
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
                    {req.profile?.first_name} {req.profile?.last_name ?? ""}
                    </p>
                    <p className="text-gray-600">@{req.profile?.username}</p>
                </div>
                <div className="space-x-2">
                    <AcceptFriendRequestButton
                    senderId={req.sender_id}
                    onSuccess={() => removeRequest(req.sender_id)}
                    />
                    <DeclineFriendRequestButton
                    senderId={req.sender_id}
                    onSuccess={() => removeRequest(req.sender_id)}
                    />
                </div>
                </li>
            ))}
            </ul>
        )}
    </div>
  );
}