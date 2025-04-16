"use client";

import { useEffect, useState } from "react";

/**
 * Toast Component
 * ----------------
 * Displays a temporary notification banner.
 *
 * Props:
 * - message: A string to display. If null, no toast is shown.
 *
 * Behavior:
 * - Automatically disappears after 4 seconds
 * - Can be reused across login, signup, or general notifications
 */
export default function Toast({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(!!message); // controls visibility

  useEffect(() => {
    // If a new message comes in, show the toast and hide it after 4s
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer); // clear timer on unmount/update
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="px-4 py-2 rounded shadow-md text-sm font-medium text-white bg-red-600">
        {message}
      </div>
    </div>
  );
}
