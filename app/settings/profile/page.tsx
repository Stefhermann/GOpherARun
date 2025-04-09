"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile, deleteProfile } from "@/app/settings/profile/actions";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  const userId = userData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile || profileError) {
    redirect("/error?message=Could-not-load-profile");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#7A0019] mb-8">
          Edit Your Profile
        </h1>

        <form action={updateProfile} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={profile.username}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] focus:border-[#FFCC33]"
              required
            />
          </div>

          {/* First and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                defaultValue={profile.first_name || ""}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] focus:border-[#FFCC33]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                defaultValue={profile.last_name || ""}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] focus:border-[#FFCC33]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Biography
            </label>
            <textarea
              name="biography"
              defaultValue={profile.biography || ""}
              rows={4}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] focus:border-[#FFCC33]"
            />
          </div>

          {/* Pronouns */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pronouns
            </label>
            <input
              type="text"
              name="pronouns"
              defaultValue={profile.pronouns || ""}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFCC33] focus:border-[#FFCC33]"
            />
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="inline-block w-full sm:w-auto bg-[#7A0019] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#600016] transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Divider */}
        <hr className="my-8" />

        {/* Delete Account */}
        <form action={deleteProfile}>
          <button
            type="submit"
            className="text-red-600 hover:underline font-medium text-sm"
          >
            Delete My Account
          </button>
        </form>
      </div>
    </div>
  );
}
