import { acceptFriendRequest } from "@/app/friends/actions";
import { useState } from "react";

export function AcceptFriendRequestButton({
  senderId,
  onSuccess,
}: {
  senderId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await acceptFriendRequest(senderId);
    onSuccess();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded text-white ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      Accept
    </button>
  );
}
