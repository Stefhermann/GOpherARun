import { createClient } from "@/utils/supabase/server";
import NavLink from "@/components/Navigation/NavLink";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

/**
 * NavBar (Server Component)
 * - Hybrid navigation bar that adapts based on user auth status.
 * - Uses server-side Supabase client to detect login state.
 */
export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <header className="bg-[#7A0019] shadow-md border-b border-[#600016]">
      <nav className="flex items-center justify-between max-w-screen-xl mx-auto px-6 py-3">
        {/* Brand logo */}
        {user ? (
          <>
            <Link
              href="/home"
              className="text-white text-xl font-extrabold tracking-wide"
            >
              Gopher Run
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="text-white text-xl font-extrabold tracking-wide"
            >
              Gopher Run
            </Link>
          </>
        )}

        {/* Center nav */}
        <div className="flex gap-6 text-sm font-medium text-white">
          {user ? (
            <>
              <NavLink href="/home" label="Home" />
              <NavLink href="/events" label="Create Event" />
              <NavLink href="/profiles" label="Find Friends" />
            </>
          ) : (
            <>
              <NavLink href="/" label="Home" />
            </>
          )}
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavLink href="/settings/profile" label="Profile" />
              <LogoutButton />
            </>
          ) : (
            <NavLink href="/login" label="Login" />
          )}
        </div>
      </nav>
    </header>
  );
}
