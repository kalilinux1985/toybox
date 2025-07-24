import { Database } from "@/lib/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"]; // NEW
export type Listing = Database["public"]["Tables"]["listings"]["Row"]; // NEW
export type ListingImage =
	Database["public"]["Tables"]["listing_images"]["Row"]; // NEW
