'use client';

import { useTransition, useState } from "react";
import { sendFriendRequest } from "@/app/friends/actions";

export function SendFriendRequestButton({ receiverId }: { receiverId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | string>(null);

  const alreadySent = status === "Request sent";

  return (
    <>
      <button
        onClick={() => {
          if (alreadySent) return;
          startTransition(async () => {
            const res = await sendFriendRequest(receiverId);
            setStatus(res.message);
          });
        }}
        className="ml-4 rounded bg-[#7A0019] px-4 py-2 text-white hover:bg-[#5A0012] transition cursor-pointer disabled:opacity-50"
        disabled={isPending || alreadySent}
      >
        {alreadySent ? "Request Sent" : isPending ? "Sending..." : "Add Friend"}
      </button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </>
  );
}


