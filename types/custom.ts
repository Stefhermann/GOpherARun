import { Database } from "./supabase";

export type Event = Database["public"]["Tables"]["events"]["Row"];

// export type Friend = Database["public"]["Tables"]["friends"]["Row"];
