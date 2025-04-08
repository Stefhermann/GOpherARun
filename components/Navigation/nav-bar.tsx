"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLink from "@/components/Navigation/nav-links";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import path from "path";

type Profile = {
  id: string;
  username: string;
};

const NavBar = () => {
  const pathname = usePathname();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log(user);
      };
      fetchUser();
    }, []);

  //use this when profile fetching figured out

  // const [profile, setProfile] = useState<Profile | null>(null);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const supabase = createClient();
  //     const { data: { user },
  //             error: userError,
  //     } = await supabase.auth.getUser();
  //     console.log(user);
  //     if (userError || !user) return;
  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("id,username")
  //       .eq("id", user.id);
  //     if (error) {
  //       console.error("Profile fetch error:", error.message);
  //     } else if (data && data.length > 0) {
  //       setProfile(data[0]);
  //     } else {
  //       console.warn("No profile found for user ID:", user.id);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  return (
    <header className="bg-white h-16 z-20 shadow-lg relative">
      <nav className="grid grid-cols-3 items-center w-[97%] mx-auto h-full">
        {/* Left Side: Logo */}
        <h1 className="text-2xl font-bold text-[#7A0019]">Gopher Run</h1>

        {/* Center: Navigation Links */}
        <div className="flex justify-center space-x-6">
          <NavLink href="/" label="Home" pathname={pathname} />
          {user && (
            <NavLink href="/events" label="Create Event" pathname={pathname} />
          )}
        </div>

        {/* Right Side: User Authentication */}
        <div className="flex justify-end">
          {user ? (
            <>
            <NavLink href={`/profiles`} label="Profile" pathname={pathname} />
            {/* Add the Sign-Out Button here */}
            <button
              className="ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut(); // Calls the signOut function from Supabase
                // Optionally, you can redirect the user after signing out
                window.location.href = "/"; // Redirect to homepage or login page
              }}
            >
              Sign Out
            </button>
          </>
          ) : (
            <NavLink href="/login" label="Login" pathname={pathname} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
