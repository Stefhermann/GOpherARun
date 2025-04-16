"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLink from "@/components/Navigation/nav-links";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

/**
 * Profile type used to extract id and username from Supabase `profiles` table
 */
type Profile = {
  id: string;
  username: string;
};

/**
 * NavBar Component
 * ----------------
 * Displays the app header with logo, nav links, and user state
 * - Shows Create Event + Profile + Sign Out when logged in
 * - Shows Login link when not authenticated
 */
const NavBar = () => {
  const pathname = usePathname();
  const supabase = createClient();

  // Stores the logged-in user's profile info (id + username)
  const [profile, setProfile] = useState<Profile | null>(null);

  /**
   * Fetches the current user's profile from Supabase
   * Runs once on mount
   */
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id,username")
        .eq("id", user.id);

      if (error) {
        console.error("Profile fetch error:", error.message);
      } else if (data && data.length > 0) {
        setProfile(data[0]);
      } else {
        console.warn("No profile found for user ID:", user.id);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="bg-white h-16 z-20 shadow-lg relative">
      <nav className="grid grid-cols-3 items-center w-[97%] mx-auto h-full">
        {/* Left Side: Logo */}
        <h1 className="text-2xl font-bold text-[#7A0019]">Gopher Run</h1>

        {/* Center: Navigation Links */}
        <div className="flex justify-center space-x-6">
          <NavLink href="/home" label="Home" pathname={pathname} />
          {profile && (
            <NavLink href="/events" label="Create Event" pathname={pathname} />
          )}
        </div>

        {/* Right Side: User Actions */}
        <div className="flex justify-end items-center space-x-4">
          {profile ? (
            <>
              {/* Link to Private Profile */}
              <NavLink
                href={`/settings/profile`}
                label="Profile"
                pathname={pathname}
              />

              {/* Sign Out Button */}
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = "/"; // Redirect to homepage
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            // Show Login link if user is not logged in
            <NavLink href="/login" label="Login" pathname={pathname} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
