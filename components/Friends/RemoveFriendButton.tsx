'use client';

import { useState, useTransition } from "react";
import { removeFriend } from "@/app/friends/actions";

export function RemoveFriendButton({ friendId }: { friendId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  const handleRemove = () => {
    const confirmed = window.confirm("Are you sure you want to remove this friend?");
    if (!confirmed) return;

    startTransition(async () => {
      const res = await removeFriend(friendId);
      setMessage(res.message);
      if (res.success) {
        setRemoved(true);
      }
    });
  };

  if (removed) return <p className="text-green-600 text-sm">Friend removed</p>;

  return (
    <div>
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "Removing..." : "Remove Friend"}
      </button>
      {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
    </div>
  );
}
