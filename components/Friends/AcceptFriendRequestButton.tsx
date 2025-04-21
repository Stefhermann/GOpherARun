'use client';

import { useTransition, useState } from "react";
import { acceptFriendRequest } from "@/app/friends/actions";

export function AcceptFriendRequestButton({ senderId }: { senderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | string>(null);

  return (
    <>
      <button
        onClick={() =>
          startTransition(async () => {
            const res = await acceptFriendRequest(senderId);
            setStatus(res.message);
          })
        }
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Accept"}
      </button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </>
  );
}