import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Get the username
  const { username } = await params;

  // Create the supabase server client
  const supabase = await createClient();

  // Get the profile row-data
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single(); // Make sure its one row

  // Check if the profile exists or if there is an error retrieving the data
  if (!profile || error) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold">@{profile.username}</h1>
      <p className="text-gray-600">
        {profile.first_name} {profile.last_name}
      </p>
      {profile.biography && (
        <p className="mt-2 text-gray-800">{profile.biography}</p>
      )}
      {profile.pronouns && (
        <p className="text-sm text-gray-500">Pronouns: {profile.pronouns}</p>
      )}
    </div>
  );
}
