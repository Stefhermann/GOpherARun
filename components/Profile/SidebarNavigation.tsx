'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const navItems = [
  { label: 'Settings', path: '/settings/profile' },
  { label: 'Friend Requests', path: '/friends/requests' },
  { label: 'Friend List', path: '/friends/list' },
];

export default function SidebarNav() {
  const router = useRouter();

  return (
    <aside className="w-48 min-h-screen bg-gray-100 border-r p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className="block w-full text-left px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
