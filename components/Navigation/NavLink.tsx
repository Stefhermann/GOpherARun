"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkProps } from "./types";

/**
 * NavLink Component
 * -----------------
 * A client-side navigation link that automatically highlights the active route.
 *
 * Features:
 * - Uses `usePathname()` to detect if the link is currently active.
 * - Applies gold text and an underline if the link matches the current route.
 * - Otherwise, renders with white text and a gold hover effect.
 * - Designed for navigation bars with a consistent visual style.
 *
 * Props:
 * - `href`: The route the link points to (e.g., "/profile")
 * - `label`: The text to display inside the link (e.g., "Profile")
 */
export default function NavLink({ href, label }: NavLinkProps) {
  // Get the current route path (e.g., "/profile")
  const pathname = usePathname();

  // Check if this link is for the currently active route
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded transition-colors duration-200 ${
        isActive
          ? "text-[#FFCC33] underline underline-offset-4" // Active: gold + underline
          : "text-white hover:text-[#FFCC33]" // Inactive: white with gold hover
      }`}
    >
      {label}
    </Link>
  );
}
