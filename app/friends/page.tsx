"use client";

import SidebarNav from "@/components/Profile/SidebarNavigation";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function FriendsListPage() {
    const [friends, setFriends] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    //wait for db changes to implement
    const fetchFriends = async (userId: string) => {
        const { data, error } = await supabase
            .from('friends')
            .select('*')
            .eq('status', 'accepted')
            .or(`initiator_id.eq.${userId},recipient_id.eq.${userId}`);
        
        if (error) {
            console.error("Error fetching friends:", error.message);
        } else {
            setFriends(data);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
          setLoading(false);
        };
        fetchUser();
      }, []);


    return (
        <div className="flex">
            <SidebarNav />
            Friends list page.
        </div>
    );
}