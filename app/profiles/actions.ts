import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  // Setup the supabase server client
  const supabase = await createClient();

  // Get the user client
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // Check if the user is logged in or check if there is an error
  if (userError || !userData.user.id) {
    redirect("/login");
  }

  // Get the current user profile data
  const { data: currData, error: currError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id);

  // Extract the fields from the form data
  const username = formData.get("username") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const biography = formData.get("biography") as string;
  const pronouns = formData.get("pronouns") as string;

  // Update the user profile with this new data that we extracted
  const { data: updateData, error: updateError } = await supabase
    .from("profiles")
    .update({
      username: username,
      first_name: first_name,
      last_name: last_name,
      biography: biography,
      pronouns: pronouns,
    })
    .eq("id", userData.user.id);
}
