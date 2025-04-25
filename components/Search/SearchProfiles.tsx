"use client";

import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { searchUsers } from "@/app/friends/actions";
import { UserProfile } from "@/app/friends/types";

/**
 * SearchProfiles Component (Client Component)
 * --------------------------------------------
 * Client-side component that allows users to live-search other users.
 * Utilizes a debounced input and server action for secure search.
 */
export default function SearchProfiles() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<UserProfile[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false); // track search state

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    startTransition(async () => {
      const users = await searchUsers(debouncedQuery.trim());
      setResults(users);
      setHasSearched(true);
    });
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search usernames..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
      />

      {isPending && <p className="text-sm text-gray-500 mb-2">Searching...</p>}

      {!isPending && hasSearched && results.length === 0 && (
        <p className="text-sm text-gray-600 italic mb-2">No users found.</p>
      )}

      <ul className="space-y-2">
        {results.map((user) => (
          <li key={user.id}>
            <Link
              href={`/profiles/${user.username}`}
              className="block px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              @{user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
