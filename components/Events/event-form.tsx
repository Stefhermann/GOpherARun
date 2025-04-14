"use client";

import { useActionState } from "react";
import { createEvent } from "@/app/events/actions";

const initialState = { message: "" };

export default function EventForm() {
  const [state, formAction] = useActionState(createEvent, initialState);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl text-[#7A0019] font-bold text-gray-800">
        Create a New Event
      </h1>

      <form action={formAction} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Morning Run"
          />
        </div>

        {/* Location Field */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Central Park, New York"
          />
        </div>

        {/* Time Field */}
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Time
          </label>
          <input
            type="datetime-local"
            id="time"
            name="time"
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-32"
            placeholder="Describe your run..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Event
          </button>
        </div>

        {/* Success/Error Message */}
        {state.message && (
          <p className="mt-4 text-center text-sm text-red-600">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
