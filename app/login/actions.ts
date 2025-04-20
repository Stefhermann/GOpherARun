"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Represents the return type of the `login` function.
 * `message` holds any error string to be shown to the user.
 */
export type LoginFormState = {
  message: string | null;
};

/**
 * login() Server Action
 * -------
 * Server Action to authenticate users using Supabase email/password auth.
 *
 * Steps:
 * - Extract `email` and `password` from FormData.
 * - Validate that both fields are present.
 * - Attempt to sign in the user using Supabase's `signInWithPassword()`.
 * - If successful, redirect to the home page.
 * - If failed, return a user-friendly error message to the client via form state.
 *
 * This action is designed to be used with `useActionState()` in a client component,
 * which will render any `message` returned by this function.
 *
 * @param prevState - The previous form state from the client
 * @param formData - The submitted form data containing `email` and `password`
 * @returns LoginFormState - Either null (success) or an error message
 */
export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = await createClient();

  // Extract form values and ensure they are strings
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation to ensure values were submitted
  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  // Attempt to authenticate the user using Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If authentication fails, return an error message for client display
  if (error) {
    return { message: error.message || "Invalid login credentials." };
  }

  // Success — redirect to home page
  redirect("/");
}

/**
 * logout() Server Action
 * --------
 * Server Action that logs the user out using Supabase Auth.
 *
 * Steps:
 * - Create a Supabase server client using cookies.
 * - Call `signOut()` to end the current session.
 * - Redirect the user back to the home page.
 *
 * This is typically used in a <form action={logout}> button.
 */
export async function logout() {
  const supabase = await createClient();

  // Sign the user out by clearing the session
  await supabase.auth.signOut();

  // Redirect back to home page after logout
  redirect("/");
}
