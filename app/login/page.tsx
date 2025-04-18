"use client";

import { login } from "@/app/login/actions";
import Link from "next/link";
import { useActionState } from "react";

// Initial state for the useActionState hook
const initialState = { message: null };

/**
 * LoginPage (Client Component)
 * ----------------------------
 * Renders a login form that submits credentials to a server action.
 * Uses Supabase for authentication and displays validation or auth errors.
 *
 * Features:
 * - Auth error messages from the server
 * - Minimal, responsive layout with background styling
 */
export default function LoginPage() {
  /**
   * useActionState Hook
   * -------------------
   * - `formAction` connects the form to the server action (`login`)
   * - `state` captures the response, such as error messages (e.g., invalid credentials)
   */
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat">
      {/* Login Form Container */}
      <form
        action={formAction} // Ties the form to the server action
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome Back!
        </h2>

        {/* Conditional error message from server-side logic */}
        {state.message && (
          <div className="text-red-600 text-sm text-center mb-4">
            {state.message}
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required // HTML5 required validation
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#7A0019] text-white py-2 px-4 rounded-md hover:bg-[#7a00188e]"
        >
          Log in
        </button>

        {/* Footer - Navigation to signup */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
