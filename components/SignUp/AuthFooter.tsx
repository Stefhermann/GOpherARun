import Link from "next/link";

/**
 * AuthFooter (Client Component)
 * - A footer link prompting users to log in if they already have an account.
 */
export default function AuthFooter() {
  return (
    <div className="text-center text-sm text-[#333]">
      Already have an account?{" "}
      <Link href="/login" className="text-[#FFB71B] hover:underline">
        Log in
      </Link>
    </div>
  );
}
