"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteEvent } from "@/app/events/actions";
import { Event } from "@/types/custom";
import EventCard from "@/components/Events/event-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Footer from "@/components/Footer/footer";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function Landing() { 
  
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            console.log(user);
            setLoading(false);
        };
        fetchUser();
    }, []);
        
    useEffect(() => {
        if (!loading && user !== null) {
            router.push('/home');
        }
    }, [loading, user]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative py-20 h-80 text-center text-[#7A0019] shadow-md">
        <div className="absolute inset-0 -z-10 bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat opacity-30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-4xl font-bold md:text-5xl">
            Find Your Running Buddy
          </h2>
          <p className="mt-4 text-lg md:text-xl">
            Join running events near you and stay motivated with a group.
          </p>
          <Link href={"/signup"}>
            <button className="mt-8 rounded-md bg-[#7A0019] px-6 py-3 text-lg font-semibold text-white hover:bg-[#5c0013] cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Main Section */}
      <main className="flex-1 flex flex-col justify-center items-center py-10">
        <section className="w-full max-w-6xl px-4 text-black">
          <h3 className="text-3xl font-bold text-[#7A0019] text-center mb-6">
            Why Join an Event?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
            {/* Motivation Block 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">
                Stay Motivated
              </h4>
              <p className="text-gray-700 text-center mt-2">
                Running with a group keeps you accountable and makes every run
                more fun! The energy of a team can push you further than running
                alone.
              </p>
            </div>

            {/* Motivation Block 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">
                Make New Friends
              </h4>
              <p className="text-gray-700 text-center mt-2">
                Meet like-minded people who share your passion for running. Turn
                workouts into social events and build lasting friendships!
              </p>
            </div>

            {/* Motivation Block 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">
                Improve Your Health
              </h4>
              <p className="text-gray-700 text-center mt-2">
                Regular running boosts heart health, reduces stress, and keeps
                you fit. Joining an event helps you stay consistent and reach
                your goals.
              </p>
            </div>

            {/* Motivation Block 4 */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <h4 className="text-xl font-semibold text-[#7A0019] mt-4">
                Have Fun & Celebrate
              </h4>
              <p className="text-gray-700 text-center mt-2">
                Running isn’t just about fitness; it’s about having fun! Enjoy
                the journey, set new challenges, and celebrate every milestone.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
