import { declineFriendRequest } from "@/app/friends/actions";
import { useState } from "react";

export function DeclineFriendRequestButton({
  senderId,
  onSuccess,
}: {
  senderId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await declineFriendRequest(senderId); // your logic
    onSuccess();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded text-white ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
      }`}
    >
      Decline
    </button>
  );
}