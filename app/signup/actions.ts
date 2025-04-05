"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Handles user signup by:
 * 1. Validating form inputs
 * 2. Creating auth user (which triggers profile creation)
 * 3. Updating the profile with additional user information
 * 4. Handling errors and rollbacks when needed
 *
 * @param {FormData} formData - The form data containing:
 *   - email: string
 *   - password: string
 *   - confirmPassword: string
 *   - username: string (required, min 3 chars)
 *   - firstName: string
 *   - lastName: string
 *   - bio: string (optional)
 *   - pronouns: string (optional)
 * @returns {Promise<void>} Redirects to appropriate page
 * @throws {Error} May throw errors during Supabase operations
 */
export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient();

  // Extract and type cast form data
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const bio = formData.get("bio") as string;
  const pronouns = formData.get("pronouns") as string;

  // Validate auth inputs
  if (password !== confirmPassword) {
    return redirect("/signup?message=Passwords-do-not-match");
  }

  if (!username || username.length < 3) {
    return redirect("/signup?message=Username-must-be-at-least-3-characters");
  }

  /**
   * Create auth user - this automatically triggers the profile creation
   * through the PostgreSQL trigger we set up
   */
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username, // Passed to trigger for initial profile creation
      },
    },
  });

  // Handle auth errors
  if (error) {
    console.error("Auth error:", error.message);
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  if (!data.user) {
    console.error("No user data returned");
    return redirect("/signup?message=Account-creation-failed");
  }

  /**
   * Update profile with additional information that wasn't
   * included in the initial trigger-based creation
   */
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      biography: bio,
      pronouns,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.user.id);

  // Handle profile update failures
  if (profileError) {
    console.error("Profile update error:", profileError.message);

    /**
     * Rollback strategy: Delete the auth user if profile update fails
     * to maintain data consistency
     */
    await supabase.auth.admin.deleteUser(data.user.id);
    return redirect("/signup?message=Failed-to-create-profile");
  }

  // Success - redirect to home
  return redirect("/");
}
