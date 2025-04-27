// Normalize user ID pair for duplicate checking
export function normalizeUserPair(
  userA: string,
  userB: string
): [string, string] {
  let sorted = [userA, userB].sort(); // returns string[] type
  return [sorted[0], sorted[1]]; // returns a tuple type
}
