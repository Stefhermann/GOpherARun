'use client';

import { useEffect, useState } from "react";
import { getFriendsList } from "@/app/friends/actions";
import { RemoveFriendButton } from "./RemoveFriendButton";

interface UserProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export function FriendsList() {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const profiles = await getFriendsList();
        setFriends(profiles);
      } catch (err) {
        console.error(err);
        setError("Failed to load friends.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <p className="text-lg text-gray-600">Loading friends...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7A0019]">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-600 text-center">You don’t have any friends yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {friend.first_name} {friend.last_name}
                </p>
                <p className="text-sm text-gray-500">@{friend.username}</p>
              </div>
              <RemoveFriendButton friendId={friend.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}