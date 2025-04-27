"use client";

import SidebarNav from "@/components/Profile/SidebarNavigation";
import { createClient } from "@/utils/supabase/client";
import { FriendsList } from "@/components/Friends/FriendsList";

const supabase = createClient();

export default function FriendsListPage() {
    return (
        <div className="flex">
            <SidebarNav />
            <FriendsList />
        </div>
    );
}