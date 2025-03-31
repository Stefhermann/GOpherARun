"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavLink from "@/components/Navigation/nav-links";

const NavBar = () => {

  const pathname = usePathname();

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
          <Link
            href="/login"
            className="px-4 py-2 bg-[#7A0019] text-white transition"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
