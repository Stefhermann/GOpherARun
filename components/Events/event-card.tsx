"use client";

import { useState } from "react";
import { Event } from "@/types/custom";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(event.id);
    setOpen(false);
  };

  return (
    <div className="relative flex w-full items-center justify-between rounded-lg bg-[#7A0019] hover:bg-[#7A0019]/50 px-4 py-3 shadow-md text-white">
      {/* Clickable Link to Event Page */}
      <Link href={`/events/${event.id}`} className="flex-grow cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <span className="text-2xl">🏃</span>

          {/* Event Info */}
          <div className="flex flex-col w-full ml-3">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold text-[#FFCC33] truncate">
                {event.title}
              </h4>
              <p className="text-sm text-gray-300 truncate mt-1">
                {event.location}
              </p>
            </div>

            {/* Time, Date, and Participant Count */}
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <p>{new Date(event.time).toLocaleString()}</p>
              <p>8/10 people</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete Button (Opens Confirmation Popup) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="absolute top-0 right-1 text-black hover:text-[#FFCC33]">
            ✖
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white text-gray-800">
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-[#7A0019] text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
