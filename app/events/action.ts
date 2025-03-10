"use server";

import { Event } from "@/types/custom";

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
 */
export async function createEvent(formData: FormData) {}

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
export async function deleteEvent(id: number) {}

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
export async function updateEvent(event: Event) {}
