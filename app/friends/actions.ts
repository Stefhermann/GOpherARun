"use server";

import { createClient } from "@/utils/supabase/server";
import { ActionResponse, UserProfile } from "./types";

/**
 * sendFriendRequest() Server Action
 * ---------------------------------
 * Initiates a new friend request to another user by inserting a record into the `friend_requests` table.
 *
 * Steps:
 * - Authenticate the current user via Supabase.
 * - Prevent unauthenticated or anonymous users from sending requests.
 * - Ensure the sender is not trying to send a request to themselves.
 * - Insert a pending request into the `friend_requests` table.
 * - Enforce request direction uniqueness using a normalized (user_low, user_high) pair.
 * - If successful, return a success message. If not, return an appropriate error.
 *
 * Notes:
 * - Supabase constraints (including RLS and unique index) help enforce data safety.
 * - The function is designed to return an `ActionResponse` object for UI consumption.
 */
export async function sendFriendRequest(
  receiverId: string
): Promise<ActionResponse> {
  // Create a Supabase server client for secure authenticated requests
  const supabase = await createClient();

  // Get the currently authenticated user
  const { data: session, error: authError } = await supabase.auth.getUser();
  const senderId = session?.user?.id;

  // Ensure the user is logged in before continuing
  if (authError || !senderId) {
    return { success: false, message: "Authentication required." };
  }

  // Prevent users from sending requests to themselves
  if (senderId === receiverId) {
    return {
      success: false,
      message: "You cannot send a request to yourself.",
    };
  }

  // Attempt to insert a new friend request into the database
  const { error: insertError } = await supabase.from("friend_requests").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    status: "pending",
  });

  // Handle potential insert errors (e.g., duplicate request)
  if (insertError) {
    return {
      success: false,
      message: insertError.message || "Could not send friend request.",
    };
  }

  // Return success message on successful request creation
  return { success: true, message: "Friend request sent." };
}

/**
 * cancelFriendRequest() Server Action
 * -----------------------------------
 * Allows the sender of a friend request to cancel (delete) it.
 *
 * Steps:
 * - Authenticate the current user.
 * - Ensure only the original sender can cancel the friend request.
 * - Attempt to delete the request from the `friend_requests` table.
 * - Return an appropriate success or error message.
 *
 * Notes:
 * - RLS should enforce that only the sender can delete the request.
 * - This does not affect the `friends` table — only pending requests.
 */
export async function cancelFriendRequest(
  receiverId: string
): Promise<ActionResponse> {
  // Create Supabase client on the server
  const supabase = await createClient();

  // Retrieve the currently logged-in user
  const { data: session, error: authError } = await supabase.auth.getUser();
  const senderId = session?.user?.id;

  // Handle unauthenticated access
  if (authError || !senderId) {
    return { success: false, message: "Authentication required." };
  }

  // Attempt to delete the friend request where sender_id = current user and receiver_id = target
  const { error: deleteError } = await supabase
    .from("friend_requests")
    .delete()
    .match({ sender_id: senderId, receiver_id: receiverId });

  // Handle database failure
  if (deleteError) {
    return {
      success: false,
      message: deleteError.message || "Failed to cancel friend request.",
    };
  }

  // Success case
  return {
    success: true,
    message: "Friend request cancelled.",
  };
}

/**
 * acceptFriendRequest() Server Action
 * -----------------------------------
 * Allows the recipient of a friend request to accept it, establishing a mutual friendship.
 *
 * Steps:
 * - Authenticate the current user.
 * - Validate that the friend request exists and is directed to the current user.
 * - Insert two rows into the `friends` table to ensure bidirectional friendship.
 * - Delete the original friend request (optional cleanup).
 * - Return a success message or an error if any step fails.
 *
 * Notes:
 * - Friendship is stored in the `friends` table as two entries (one for each direction).
 * - The function assumes frontend has already verified that the request is in `pending` state.
 * - This function is protected by RLS policies which only allow the receiver to perform this update.
 */
export async function acceptFriendRequest(
  senderId: string
): Promise<ActionResponse> {
  const supabase = await createClient();

  // Get the authenticated user (the one accepting the request)
  const { data: session, error: authError } = await supabase.auth.getUser();
  const receiverId = session?.user?.id;

  if (authError || !receiverId) {
    return { success: false, message: "Authentication required." };
  }

  if (senderId === receiverId) {
    return { success: false, message: "Cannot accept your own request." };
  }

  console.log(senderId);
  console.log(receiverId);

  // Verify the friend request exists and is directed to this user
  const { data: request, error: requestError } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("status", "pending")
    .single();

  if (!request || requestError) {
    return {
      success: false,
      message: "No valid friend request found.",
    };
  }

  // Insert two rows into the friends table (bidirectional friendship)
  const { error: insertError } = await supabase
    .from("friends")
    .insert([{ user_initiator: receiverId, user_friend: senderId }]);

  if (insertError) {
    return {
      success: false,
      message: insertError.message || "Failed to create friendship.",
    };
  }

  // Delete the friend request after acceptance (optional cleanup)
  const { error: deleteError } = await supabase
    .from("friend_requests")
    .delete()
    .eq("id", request.id);

  if (deleteError) {
    // Not critical, just log it
    console.warn("Friend request deletion failed:", deleteError.message);
  }

  // Success case
  return {
    success: true,
    message: "Friend request accepted.",
  };
}

/**
 * declineFriendRequest() Server Action
 * ------------------------------------
 * Allows a user to decline a friend request, effectively rejecting it.
 *
 * Steps:
 * - Authenticate the current user.
 * - Ensure the user is the recipient of the pending friend request.
 * - Delete the request from the `friend_requests` table.
 * - Return a success message if deletion succeeds, or an error otherwise.
 *
 * Notes:
 * - RLS ensures that only the recipient can decline the request.
 * - This operation is irreversible (request is deleted, not marked).
 * - The frontend is expected to confirm with the user before calling this.
 */
export async function declineFriendRequest(
  senderId: string
): Promise<ActionResponse> {
  const supabase = await createClient();

  // Get current authenticated user (recipient of the request)
  const { data: session, error: authError } = await supabase.auth.getUser();
  const receiverId = session?.user?.id;

  if (authError || !receiverId) {
    return { success: false, message: "Authentication required." };
  }

  // Prevent user from rejecting their own sent request
  if (senderId === receiverId) {
    return {
      success: false,
      message: "Invalid operation.",
    };
  }

  // Attempt to delete the friend request (only if user is receiver)
  const { error: deleteError } = await supabase
    .from("friend_requests")
    .delete()
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("status", "pending");

  if (deleteError) {
    return {
      success: false,
      message: deleteError.message || "Failed to decline request.",
    };
  }

  return {
    success: true,
    message: "Friend request declined.",
  };
}

/**
 * removeFriend() Server Action
 * ----------------------------
 * Allows a user to unfriend another user by removing the friendship record.
 *
 * Steps:
 * - Authenticate the current user.
 * - Normalize user IDs into (user_low, user_high) ordering to match unique constraint.
 * - Delete the friendship from the `friends` table.
 * - Return a success message on completion or an error if failed.
 *
 * Notes:
 * - Friendships are stored once with normalized ordering — not duplicated.
 * - RLS must allow either user in the pair to delete the friendship.
 * - This action is irreversible unless users send new requests.
 */
export async function removeFriend(friendId: string): Promise<ActionResponse> {
  const supabase = await createClient();

  // Get the currently authenticated user
  const { data: session, error: authError } = await supabase.auth.getUser();
  const userId = session?.user?.id;

  if (authError || !userId) {
    return { success: false, message: "Authentication required." };
  }

  // Prevent edge case of unfriending self
  if (userId === friendId) {
    return {
      success: false,
      message: "Invalid operation: You cannot unfriend yourself.",
    };
  }

  // Delete the directional friendship where the user is the initiator
  const { error: deleteError } = await supabase.from("friends").delete().match({
    user_initiator: userId, // Current user must be initiator (RLS enforced)
    user_friend: friendId, // Target friend is the one being removed
  });

  if (deleteError) {
    return {
      success: false,
      message: deleteError.message || "Failed to remove friend.",
    };
  }

  return {
    success: true,
    message: "Friend removed successfully.",
  };
}

/**
 * getFriendStatus()
 * ------------------
 * Determines the relationship status between the current user and another user.
 *
 * Possible return values:
 * - "friends" → They are already friends
 * - "incoming_request" → The other user sent you a request
 * - "outgoing_request" → You sent a request to the other user
 * - "none" → No existing relationship
 *
 * Notes:
 * - This is useful for displaying context-aware UI (e.g., "Add Friend", "Cancel Request", etc.)
 */
export async function getFriendStatus(
  targetUserId: string
): Promise<"friends" | "incoming_request" | "outgoing_request" | "none"> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return "none";

  const currentUserId = user.id;

  if (currentUserId === targetUserId) return "none";

  // Normalize for consistent friendship record
  const [userLow, userHigh] =
    currentUserId < targetUserId
      ? [currentUserId, targetUserId]
      : [targetUserId, currentUserId];

  // Check if they are friends
  const { data: friendsData } = await supabase
    .from("friends")
    .select("id")
    .or(
      `and(user_initiator.eq.${currentUserId},user_friend.eq.${targetUserId}),and(user_initiator.eq.${targetUserId},user_friend.eq.${currentUserId})`
    )
    .maybeSingle();

  if (friendsData) return "friends";

  // Check if current user sent a pending request
  const { data: sentRequest } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("sender_id", currentUserId)
    .eq("receiver_id", targetUserId)
    .eq("status", "pending")
    .maybeSingle();

  if (sentRequest) return "outgoing_request";

  // Check if the other user sent a pending request to current user
  const { data: receivedRequest } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("sender_id", targetUserId)
    .eq("receiver_id", currentUserId)
    .eq("status", "pending")
    .maybeSingle();

  if (receivedRequest) return "incoming_request";

  return "none";
}

/**
 * getFriendsList()
 * -----------------
 * Returns a list of accepted friends for the current authenticated user.
 *
 * The query searches for matches where the current user appears in either
 * the `user_low` or `user_high` field of the `friends` table.
 * Then, it selects the corresponding profile from the opposite user.
 */
export async function getFriendsList(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user)
    throw new Error("Something was wrong getting the user data");

  const userId = user.id;

  // Query all friend relationships for current user and fetch the other profile
  const { data: friendships, error: fetchError } = await supabase
    .from("friends")
    .select("user_initiator, user_friend")
    .or(`user_initiator.eq.${userId},user_friend.eq.${userId}`);

  if (fetchError || !friendships) return [];

  const friendIds = friendships.map((f) =>
    f.user_initiator === userId ? f.user_friend : f.user_initiator
  );

  if (friendIds.length === 0) return [];

  // Fetch profiles of all friend IDs
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, first_name, last_name")
    .in("id", friendIds);

  if (profileError || !profiles) return [];

  return profiles;
}

/**
 * searchUsers() Server Action
 * ---------------------------
 * Searches users by partial username for the purpose of sending friend requests.
 *
 * - Performs a case-insensitive prefix match (e.g., "jo" matches "john", "Joanna")
 * - Limits results to prevent overload (e.g., 10 max)
 * - Excludes the currently logged-in user from the results
 *
 * @param query - The partial username string to search for
 * @returns An array of matching public user profiles (id, username, first_name, last_name)
 */
export async function searchUsers(query: string): Promise<UserProfile[]> {
  const supabase = await createClient();

  // Get the current authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  if (!query || query.trim().length === 0) {
    return [];
  }

  // Perform case-insensitive prefix search on username, excluding the current user
  const { data: users, error: searchError } = await supabase
    .from("profiles")
    .select("id, username, first_name, last_name")
    .ilike("username", `${query.trim()}%`)
    .neq("id", user.id)
    .limit(10);

  if (searchError) {
    console.error("Error searching users:", searchError.message);
    return [];
  }

  return users ?? [];
}
