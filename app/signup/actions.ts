"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
    const supabase = await createClient();
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validate passwords match before sending request
    if (data.password !== data.confirmPassword) {
      redirect("/signup?message=Passwords do not match");
    }
  
    const { error } = await supabase.auth.signUp(data);
  
    if (error) {
      redirect("/signup?message=Error Signing Up");
    }
  
    revalidatePath("/", "layout");
    redirect("/");
  }