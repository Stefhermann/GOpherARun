"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { deleteEvent } from "@/app/events/actions";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";

// Fake participants list for frontend testing
const mockParticipants = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Johnson" },
  { id: 4, name: "Emily Williams" },
  { id: 5, name: "David Brown" },
  { id: 6, name: "Stefan Hermann" },
  { id: 7, name: "Sidd Lotlikar" },
  { id: 8, name: "Xander Hill" },
];

export default function EventPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
  
      if (error) {
        console.error("Error fetching event:", error.message);
      } else {
        setEvent(data);
      }
    };
  
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setCurrentUser(user);
      }
    };
  
    // Fetch user and event simultaneously
    Promise.all([fetchUser(), fetchEvent()])
      .then(() => setLoading(false)) // Set loading false after both are done
      .catch((error) => {
        console.error("Error during fetch:", error);
        setLoading(false);
      });
  }, [eventId]);
  
  // Handle Delete Event
  const handleDelete = async () => {
    const result = await deleteEvent(eventId);
    if (result.message === "Event deleted successfully!") {
      router.push("/"); // Redirect to home page
    } else {
      console.error(result.message);
    }
  };

  // Handle Join Event (Shows Popup)
  const handleJoin = async () => {
    setJoinSuccess(true); // Open success popup
  };

  console.log(currentUser);
  console.log(event);

  if (loading)
    return <div className="text-center mt-10 text-white">Loading event...</div>;

  return (
    <div className="min-h-screen bg-[#7A0019] text-white">

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white text-gray-900 p-8 rounded-sm shadow-lg">
          {/* Left Column - Split into Event Details & Participants */}
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              {/* Left Section - Event Details */}
              <div>
                <h1 className="text-4xl font-bold text-[#7A0019]">
                  {event.title}
                </h1>
                <p className="text-lg text-gray-700 mt-2">{event.location}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {new Date(event.time).toLocaleString()}
                </p>

                <p className="text-lg text-gray-700 mt-4">Run Description: </p>
                <p className="text-md text-gray-700 mt-2">
                  We&apos;ll be running through scenic trails, maintaining a
                  steady pace suitable for beginners. This is a great
                  opportunity to meet fellow runners, enjoy the fresh air, and
                  challenge yourself. Arrive 5 minutes early to warm up and so
                  you don’t miss out!
                </p>
              </div>

              {/* Right Section - Scrollable Participants List */}
              <div>
                <h3 className="flex mt-2 text-xl font-bold text-[#7A0019] mb-2 justify-between">
                  Participants
                  <p className="mt-1 text-sm text-black">8/10 People</p>
                </h3>
                <ScrollArea className="h-80 w-full rounded-lg border">
                  <div className="p-3 space-y-3">
                    {mockParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg shadow-sm"
                      >
                        <Image
                          src="/UnknownUser.png"
                          alt={participant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <p className="text-gray-900 font-medium">
                          {participant.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              {/* Join Event Button with Success Popup */}
              <Dialog open={joinSuccess} onOpenChange={setJoinSuccess}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
                    onClick={handleJoin}
                  >
                    Join Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white text-gray-900">
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescription>
                    You have successfully joined the event!
                  </DialogDescription>
                  <DialogFooter>
                    <Button onClick={() => setJoinSuccess(false)}>OK</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Event Button with Confirmation Popup */}
              {(currentUser.id === event.creatorID) && (<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg">
                    Delete Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white text-gray-900">
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete{" "}
                    <strong>{event.title}</strong>? This action cannot be
                    undone.
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog> )}
            </div>
          </div>

          {/* Left Column - Event Image */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 md:h-full bg-gray-300 rounded-sm flex items-center justify-center">
              <Image
                src="/BasicMap.webp"
                alt="Location of Run"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-sm px-2 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
