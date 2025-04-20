import Link from "next/link";

/**
 * AuthFooter Component (Client Component)
 * ---------------------------------------
 * A simple footer element shown at the bottom of the signup form.
 *
 * Purpose:
 * - Provides a helpful call-to-action for users who already have an account.
 * - Offers a link to the login page.
 *
 * Usage:
 * - Included at the bottom of the <SignUpForm />.
 * - Appears after the submit button.
 */
export default function AuthFooter() {
  return (
    <div className="text-center text-sm text-[#333]">
      {/* Prompt text */}
      Already have an account?{" "}
      {/* Link to login page with gold hover color for visual emphasis */}
      <Link href="/login" className="text-[#FFB71B] hover:underline">
        Log in
      </Link>
    </div>
  );
}
