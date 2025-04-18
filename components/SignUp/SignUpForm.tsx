"use client";

import TextField from "../ui/textfield";
import SubmitButton from "./SubmitButton";
import AuthFooter from "./AuthFooter";
import { signup } from "@/app/signup/actions";
import { useActionState } from "react";

/**
 * Initial state for form validation messages
 */
const initialState = { message: null };

/**
 * SignUpForm (Client Component)
 * - Uses server action + useFormState for server validation
 * - Displays form errors
 */
export default function SignUpForm() {
  const [state, formAction] = useActionState(signup, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat">
      <form
        action={formAction}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7A0019]">
          Join Gopher Run
        </h2>

        {/* Show validation or auth error message */}
        {state.message && (
          <div className="text-red-600 text-sm mb-4 text-center">
            {state.message}
          </div>
        )}

        <TextField name="email" type="email" label="Email" required />

        <TextField
          name="password"
          type="password"
          label="Password"
          required
          minLength={6}
        />

        <TextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          required
          minLength={6}
        />

        <TextField
          name="username"
          label="Username"
          required
          minLength={3}
          maxLength={32}
        />

        <TextField name="firstName" label="First Name" required />
        <TextField name="lastName" label="Last Name" />
        <TextField name="bio" label="Bio" isTextArea rows={3} />
        <TextField
          name="pronouns"
          label="Pronouns"
          placeholder="e.g., she/her, they/them"
        />

        {/* Server-safe button with styling */}
        <SubmitButton />
        <AuthFooter />
      </form>
    </div>
  );
}
