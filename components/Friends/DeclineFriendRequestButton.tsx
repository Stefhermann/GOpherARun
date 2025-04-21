'use client';

import { useTransition, useState } from "react";
import { declineFriendRequest } from "@/app/friends/actions";

export function DeclineFriendRequestButton({ senderId }: { senderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | string>(null);

  return (
    <>
      <button
        onClick={() =>
          startTransition(async () => {
            const res = await declineFriendRequest(senderId);
            setStatus(res.message);
          })
        }
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Decline"}
      </button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </>
  );
}