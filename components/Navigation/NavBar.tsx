import { createClient } from "@/utils/supabase/server";
import NavLink from "@/components/Navigation/NavLink";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

/**
 * NavBar Component (Server Component)
 * -----------------------------------
 * A hybrid navigation bar that dynamically adjusts its content based on
 * the user's authentication status.
 *
 * Features:
 * - Uses Supabase server-side client to fetch the current user session.
 * - Displays different navigation links for logged-in vs. logged-out users.
 * - Highlights branding and navigation with University of Minnesota-inspired colors.
 *
 * Structure:
 * - Left: App brand ("Gopher Run")
 * - Center: Navigation links (e.g., Home, Create Event)
 * - Right: Profile link & Logout (if logged in), or Login link (if not)
 */
export default async function NavBar() {
  const supabase = await createClient();

  // Fetch the currently logged-in user from the Supabase Auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optionally fetch the user profile for personalized navigation (e.g., /profile/[username])
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
        {/* Left: Application brand/logo */}
        {user ? (
          // When logged in, link to authenticated home
          <Link
            href="/home"
            className="text-white text-xl font-extrabold tracking-wide"
          >
            Gopher Run
          </Link>
        ) : (
          // When logged out, link to public landing page
          <Link
            href="/"
            className="text-white text-xl font-extrabold tracking-wide"
          >
            Gopher Run
          </Link>
        )}

        {/* Center: Primary navigation links */}
        <div className="flex gap-6 text-sm font-medium text-white">
          {user ? (
            <>
              {/* Logged-in users see main dashboard and event tools */}
              <NavLink href="/home" label="Home" />
              <NavLink href="/events" label="Create Event" />
            </>
          ) : (
            <>
              {/* Public users only see landing page */}
              <NavLink href="/" label="Home" />
            </>
          )}
        </div>

        {/* Right: Profile and Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* If logged in, show profile and logout */}
              <NavLink href="/settings/profile" label="Profile" />
              <LogoutButton />
            </>
          ) : (
            // Otherwise show login button
            <NavLink href="/login" label="Login" />
          )}
        </div>
      </nav>
    </header>
  );
}
