"use client";

import TextField from "../ui/textfield";
import SubmitButton from "./SubmitButton";
import AuthFooter from "./AuthFooter";
import { signup } from "@/app/signup/actions";
import { useActionState } from "react";

/**
 * This stores the server response after form submission.
 * It contains a `message` property that holds validation or error feedback
 * returned from the server-side action.
 */
const initialState = { message: null };

/**
 * SignUpForm Component
 * --------------------
 * A client-side form that handles user registration by submitting data to a
 * server action (`signup`) and then rendering server-side validation results.
 *
 * Responsibilities:
 * - Renders a visually styled signup form with Tailwind CSS.
 * - Collects user inputs using reusable `<TextField />` UI components.
 * - Uses `useActionState` to manage form submission and display server feedback.
 * - Provides accessibility and error feedback.
 */
export default function SignUpForm() {
  /**
   * useActionState()
   * ----------------
   * React hook that tracks the current state of the form submission.
   * - `signup` is the server action being called.
   * - `formAction` is passed into the <form action=...> to connect the server action.
   * - `state` stores the response, which could include validation errors.
   */
  const [state, formAction] = useActionState(signup, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat">
      <form
        action={formAction} // connect the form submission to the server action
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        {/* Form Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7A0019]">
          Join Gopher Run
        </h2>

        {/* Server-side validation message (like invalid input or auth errors) */}
        {state.message && (
          <div className="text-red-600 text-sm mb-4 text-center">
            {state.message}
          </div>
        )}

        {/* Input Fields */}
        {/* Email: required, validated server-side */}
        <TextField name="email" type="email" label="Email" required />

        {/* Password: minimum length handled client-side and server-side */}
        <TextField
          name="password"
          type="password"
          label="Password"
          required
          minLength={6}
        />

        {/* Confirm Password: validated on server (must match password) */}
        <TextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          required
          minLength={6}
        />

        {/* Username: regex validated on server (must start with letter, no spaces/symbols) */}
        <TextField
          name="username"
          label="Username"
          required
          minLength={3}
          maxLength={32}
        />

        {/* First Name: required, no whitespace, validated on server */}
        <TextField name="firstName" label="First Name" required />

        {/* Last Name: optional, validated server-side (letters only) */}
        <TextField name="lastName" label="Last Name" />

        {/* Bio: optional, accepts paragraphs */}
        <TextField name="bio" label="Bio" isTextArea rows={3} />

        {/* Pronouns: optional */}
        <TextField
          name="pronouns"
          label="Pronouns"
          placeholder="e.g., she/her, they/them"
        />

        {/* Submit button (calls the server action) */}
        <SubmitButton />

        {/* Footer with link to login */}
        <AuthFooter />
      </form>
    </div>
  );
}
