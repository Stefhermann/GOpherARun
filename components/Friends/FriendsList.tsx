'use client';

import { useEffect, useState } from "react";
import { getFriendsList } from "@/app/friends/actions";
import { RemoveFriendButton } from "./RemoveFriendButton";
import Link from "next/link";

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
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7A0019]">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-600 text-center">You don’t have any friends yet.</p>
      ) : (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
            >
              <Link
                href={`/profiles/${friend.username}`}
                className="block px-4 py-2 border rounded-md hover:bg-gray-100 transition"
              >
                <p className="text-lg font-medium text-gray-800">
                  {friend.first_name} {friend.last_name}
                </p>
                <p className="text-sm text-gray-500">@{friend.username}</p>
              </Link>
              {/* <div>
                <p className="text-lg font-medium text-gray-800">
                  {friend.first_name} {friend.last_name}
                </p>
                <p className="text-sm text-gray-500">@{friend.username}</p>
              </div> */}
              <RemoveFriendButton friendId={friend.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}