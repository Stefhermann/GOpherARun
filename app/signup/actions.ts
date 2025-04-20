"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Zod Validation Schema
 * ---------------------
 * Enforces rules for all user-submitted fields from the signup form.
 * Ensures:
 * - Username starts with a letter and contains only letters or numbers (no spaces or symbols).
 * - No whitespace in username, first name, or last name.
 * - Email format is valid.
 * - Passwords match and are at least 6 characters long.
 * - Optional fields (bio, pronouns) are allowed but sanitized.
 */
const SignupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(32, "Username must be at most 32 characters.")
      .regex(/^[A-Za-z][A-Za-z0-9]*$/, {
        message:
          "Username must start with a letter and contain only letters or numbers (no spaces or symbols).",
      }),
    email: z
      .string()
      .email({ message: "Email must be a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, { message: "First name is required." })
      .regex(/^[A-Za-z]+$/, {
        message: "First name must contain only letters (no spaces or numbers).",
      }),
    lastName: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z
        .string()
        .regex(/^[A-Za-z]*$/, {
          message:
            "Last name must contain only letters (no spaces or numbers).",
        })
        .optional()
    ),
    bio: z.string().optional(),
    pronouns: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().optional()
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Shared form state returned to the client
 * Used for `useActionState()` in client components to display server-side validation errors
 */
export type SignupFormState = {
  message: string | null;
  success?: boolean;
};

/**
 * signup() Server Action
 * -----------------------
 * Handles user registration and profile setup using Supabase and PostgreSQL trigger-based logic.
 *
 * Steps:
 * - Extract and sanitize form fields from FormData.
 * - Validate input using the Zod schema.
 * - Check that the username is not already taken using a Supabase query.
 * - Create a new user with Supabase Auth.
 * - Let the PostgreSQL trigger insert a corresponding row in the `profiles` table.
 * - After a delay (to wait for the trigger), update additional profile fields.
 * - If all succeeds, redirect to the homepage.
 * - Otherwise, return an appropriate error message for the UI.
 *
 * Notes:
 * - This function is designed to be used with `useActionState()` and should never throw.
 * - Only `bio` is allowed to contain whitespace or full sentences.
 */
export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const supabase = await createClient();

  // Safely extract and trim all inputs to remove accidental whitespace
  const data = {
    username: (formData.get("username") as string)?.trim(),
    email: (formData.get("email") as string)?.trim(),
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    firstName: (formData.get("firstName") as string)?.trim(),
    lastName: (formData.get("lastName") as string)?.trim(),
    bio: formData.get("bio") as string,
    pronouns: (formData.get("pronouns") as string)?.trim(),
  };

  // Run input validation using the schema
  const parsed = SignupSchema.safeParse(data);
  if (!parsed.success) {
    // If validation fails, return the first error message for user feedback
    return { message: parsed.error.errors[0].message };
  }

  /**
   * Check for username uniqueness BEFORE attempting to create the user
   * This prevents duplicate usernames even if they pass client-side validation
   */
  const { data: existingUsername } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", data.username)
    .single();

  if (existingUsername) {
    return {
      message: "Username is already taken. Please choose another one.",
    };
  }

  // Register the user with Supabase Auth
  const { error: signupError, data: userData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username, // this triggers the profile INSERT via SQL trigger
      },
    },
  });

  // Check for errors during auth signup
  if (signupError || !userData.user) {
    return {
      message:
        signupError?.message || "Account creation failed. Please try again.",
    };
  }

  // Delay to allow PostgreSQL trigger to populate the profile row
  await new Promise((res) => setTimeout(res, 500));

  // Update additional profile details not handled by the trigger
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: data.firstName,
      last_name: data.lastName || null,
      biography: data.bio || null,
      pronouns: data.pronouns || null,
    })
    .eq("id", userData.user.id);

  // If profile update fails, inform the user
  if (profileError) {
    return { message: "Profile update failed. Please try again." };
  }

  // redirect to home
  redirect("/");
}
