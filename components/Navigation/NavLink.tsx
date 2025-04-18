"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkProps } from "./types";

/**
 * NavLink (Client Component)
 * - Nav link with gold hover and underline for active route.
 */
export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded transition-colors duration-200 ${
        isActive
          ? "text-[#FFCC33] underline underline-offset-4"
          : "text-white hover:text-[#FFCC33]"
      }`}
    >
      {label}
    </Link>
  );
}
