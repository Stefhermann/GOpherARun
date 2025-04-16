"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type LoginFormState = {
  message: string | null;
};

/**
 * Login Server Action
 * - Authenticates with Supabase
 * - Returns error messages for invalid credentials
 */
export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message || "Invalid login credentials." };
  }

  redirect("/");
}
