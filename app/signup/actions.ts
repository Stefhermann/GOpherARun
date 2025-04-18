"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Define a validation schema using Zod
 * - Enforces username format, email, password length
 * - Adds a custom refinement to ensure password === confirmPassword
 */
const SignupSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(/^[A-Za-z][A-Za-z0-9]*$/, { // I hate regex, but damn its useful
        message:
          "Username must start with a letter and only contain letters or numbers (no symbols).",
      }),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().optional(),
    pronouns: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Form state structure shared with the client
 */
export type SignupFormState = {
  message: string | null;
};

/**
 * Server Action: Handles form submission from the signup page
 */
export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const supabase = await createClient();

  // Parse raw form data into usable strings
  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    bio: formData.get("bio") as string,
    pronouns: formData.get("pronouns") as string,
  };

  // Run validation using Zod
  const parsed = SignupSchema.safeParse(data);
  if (!parsed.success) {
    // Return first validation error to the frontend
    return { message: parsed.error.errors[0].message };
  }

  // Create Supabase user (triggers row in `profiles` via PostgreSQL trigger)
  const { error, data: userData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username, // important: must match trigger logic
      },
    },
  });

  // Handle user creation errors
  if (error || !userData.user) {
    return { message: error?.message || "Account creation failed" };
  }

  // Wait briefly to allow the database trigger to create the `profiles` row
  await new Promise((r) => setTimeout(r, 500));

  // Update the profile with optional extra fields
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      biography: data.bio,
      pronouns: data.pronouns,
    })
    .eq("id", userData.user.id);

  if (profileError) {
    return { message: "Profile update failed." };
  }

  // On success, redirect to home
  redirect("/");
}
