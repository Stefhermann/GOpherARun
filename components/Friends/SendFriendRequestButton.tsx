"use client";

import { useState } from 'react';
import { sendFriendRequest } from '@/app/friends/actions';

export const SendFriendRequestButton = ({ receiverId }: { receiverId: string}) => {
  const [isDisabled, setIsDisabled] = useState(false); // State to handle button disabling

  const handleClick = async () => {
    setIsDisabled(true); // Disable the button immediately after click

    try {
      // Send the friend request to Supabase
      sendFriendRequest(receiverId);
    } catch (error) {
      console.error("Error occurred while sending friend request:", error);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isDisabled}  // The button will be disabled immediately after click
      className="btn btn-primary"
    >
      Send Friend Request
    </button>
  );
};



