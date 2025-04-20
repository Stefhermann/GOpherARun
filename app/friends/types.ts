/**
 * A standardized structure for responses returned from server actions.
 * This makes it easier to handle success and error messaging in the UI consistently.
 */
export type ActionResponse = {
  /** Indicates whether the action was successful */
  success: boolean;
  /** A message describing the result of the action (used for UI feedback or error handling) */
  message: string;
};

/**
 * UserProfile Interface
 * ----------------------
 * Represents a minimal user profile as retrieved from the `profiles` table.
 * Used in contexts such as:
 * - Friends list rendering
 * - Friend search results
 * - Participant listings
 */
export interface UserProfile {
  /** Unique identifier of the user (linked to auth.users.id) */
  id: string;

  /** The user's public-facing username (must be unique) */
  username: string;

  /** Optional: User's first name (can be used for display or personalization) */
  first_name?: string;

  /** Optional: User's last name */
  last_name?: string;
}
