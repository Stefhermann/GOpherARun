"use client";

/**
 * SubmitButton (Client Component)
 * -------------------------------
 * - A styled form submit button with UMN-themed colors.
 */
export default function SubmitButton() {
  return (
    <button
      type="submit"
      className="w-full bg-[#7A0019] text-white py-2 px-4 rounded-md hover:bg-[#5a0012] transition-colors mb-4"
    >
      Create Account
    </button>
  );
}
