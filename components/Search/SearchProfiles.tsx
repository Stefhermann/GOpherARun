'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SearchProfiles() {
  const supabase = createClient();
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 300); // prevent querying on every keystroke
  const [results, setResults] = useState<{ username: string}[]>([]);

  useEffect(() => {
    if (!debouncedQuery) return setResults([]);

    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', `%${debouncedQuery}%`)
        .limit(10);

      if (error) {
        console.error('Search error:', error);
      } else {
        setResults(data);
      }
    };

    fetchProfiles();
  }, [debouncedQuery, supabase]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search usernames..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
      />

      <ul className="space-y-2">
        {results.map((user) => (
          <li key={user.username}>
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
