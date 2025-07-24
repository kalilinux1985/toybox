import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are defined.
// They are prefixed with NEXT_PUBLIC_ for client-side access in Next.js.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}
if (!supabaseAnonKey) {
	throw new Error(
		"Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
