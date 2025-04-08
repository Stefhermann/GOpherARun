"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLink from "@/components/Navigation/nav-links";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import path from "path";

const NavBar = () => {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <header className="bg-white h-16 z-20 shadow-lg relative">
      <nav className="grid grid-cols-3 items-center w-[97%] mx-auto h-full">
        {/* Left Side: Logo */}
        <h1 className="text-2xl font-bold text-[#7A0019]">Gopher Run</h1>

        {/* Center: Navigation Links */}
        <div className="flex justify-center space-x-6">
          <NavLink href="/" label="Home" pathname={pathname} />
          <NavLink href="/events" label="Create Event" pathname={pathname} />
        </div>

        {/* Right Side: User Authentication */}
        <div className="flex justify-end">
          {user ? (
            <NavLink href={`/profiles/${user.user_metadata?.username}`} label="Profile" pathname={pathname} />
          ) : (
            <NavLink href="/login" label="Login" pathname={pathname} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
