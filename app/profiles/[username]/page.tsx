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
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12 flex justify-center items-start">
      <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-4xl font-bold text-[#7A0019]">
            @{profile.username}
          </h1>
          <p className="text-xl font-medium text-[#7A0019]">
            {profile.first_name} {profile.last_name}
          </p>
        </div>

        {profile.biography && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#7A0019] mb-1">
              Biography
            </h2>
            <p className="text-gray-800">{profile.biography}</p>
          </div>
        )}

        {profile.pronouns && (
          <div className="mt-4">
            <span className="inline-block bg-[#FFCC33] text-[#7A0019] text-sm font-semibold px-3 py-1 rounded-full">
              Pronouns: {profile.pronouns}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
