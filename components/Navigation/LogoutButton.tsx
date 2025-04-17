"use server";
import { logout } from "@/app/login/actions";

/**
 * LogoutButton (Server Component)
 * -------------------------------
 * Triggers Supabase sign-out and redirects to homepage.
 */
export default async function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="bg-white text-[#7A0019] px-4 py-1.5 rounded-md font-semibold text-sm hover:bg-[#FFCC33] hover:text-black transition"
      >
        Sign Out
      </button>
    </form>
  );
}
