"use server";

import { Event } from "@/types/custom";
import { createClient } from "@/utils/supabase/server";

/**
 * Adds a new event to the database.
 *
 * This function:
 * - Extracts event details (e.g., title, location, time) from the form data.
 * - Validates the input data to ensure all required fields are present.
 * - Inserts the new event into the `Events` table in the Supabase database.
 * - Handles errors and returns appropriate feedback if the operation fails.
 *
 * @param {FormData} formData - The form data containing the event details.
 * @param {{message: string}} prevState - The previous state of the form (not really needed yet).
 */
export async function createEvent(
  prevState: { message: string },
  formData: FormData
) {
  // Initialize the Supabase client.
  const supabase = await createClient();

  // Extract the form data.
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const time = formData.get("time") as string;

  // Insert the event into the database.
  const { error } = await supabase.from("events").insert({
    title,
    location,
    time: new Date(time).toISOString(), // Convert to ISO string for Supabase.
  });

  if (error) {
    // If there's an error, log it and throw an exception.
    console.error("Error creating event:", error.message);
    throw new Error("Failed to create event.");
  }
  // return a message indicating that the forms were submitted.
  return { message: "Form submitted!" };
}

/**
 * Deletes an event from the database.
 *
 * This function:
 * - Takes the ID of the event to delete.
 * - Ensures the user has permission to delete the event (e.g., the user is the creator). DO THIS PART LATER
 * - Deletes the event from the `Events` table in the Supabase database.
 * - Handles errors and returns appropriate feedback if the operation fails.
 *
 * @param {number} id - The ID of the event to delete.
 */
export async function deleteEvent(id: string) {
  // Initialize the Supabase client.
  const supabase = await createClient();
  try {
    // Delete the event from the database.
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      // If there's an error, return a message.
      console.error("Error deleting event:", error.message);
      return { message: "Failed to delete event. Please try again." };
    }

    // Return a success message.
    return { message: "Event deleted successfully!" };
  } catch (error) {
    // If an exception occurs, return a message.
    console.error("Unexpected error deleting event:", error);
    return { message: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Updates an existing event in the database.
 *
 * This function:
 * - Takes an `Event` object containing the updated event details.
 * - Ensures the user has permission to update the event (e.g., the user is the creator). DO THIS PART LATER
 * - Updates the event in the `Events` table in the Supabase database.
 * - Handles errors and returns appropriate feedback if the operation fails.
 *
 * @param {Event} event - The event object containing the updated details.
 */
export async function updateEvent(event: Event) {
  // Initialize the Supabase client.
  const supabase = await createClient();

  try {
    // Update the event in the database.
    const { error } = await supabase
      .from("events")
      .update({
        title: event.title,
        location: event.location,
        time: new Date(event.time).toISOString(), // Convert to ISO string for Supabase.
      })
      .eq("id", event.id); // Match the event by ID.

    if (error) {
      // If there's an error, return a message.
      console.error("Error updating event:", error.message);
      return { message: "Failed to update event. Please try again." };
    }

    // Return a success message.
    return { message: "Event updated successfully!" };
  } catch (error) {
    // If an exception occurs, return a message.
    console.error("Unexpected error updating event:", error);
    return { message: "An unexpected error occurred. Please try again." };
  }
}
