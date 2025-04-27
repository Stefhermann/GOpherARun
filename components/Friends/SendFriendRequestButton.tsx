"use client";

import { useState } from 'react';
import { sendFriendRequest } from '@/app/friends/actions';

export const SendFriendRequestButton = ({ receiverId, wasDisabled }: { receiverId: string, wasDisabled: boolean}) => {
  const [isDisabled, setIsDisabled] = useState(wasDisabled); // State to handle button disabling

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
      className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-200 
      ${isDisabled 
        ? 'bg-green-300 cursor-not-allowed' 
        : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}`}
    >
      Send Friend Request
    </button>
  );
};



