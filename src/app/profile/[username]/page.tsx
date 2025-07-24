// app/profile/[username]/page.tsx
import SellerProfileTopSection from "@/components/SellerProfileTopSection";
import SellerProfileDetails from "@/components/SellerProfileDetails"; // Import the new component
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface SellerProfilePageProps {
	params: {
		username: string;
	};
}

export default async function SellerProfilePage({
	params,
}: SellerProfilePageProps) {
	const cookieStore = cookies();
	const supabase = createClient();
	
	const resolvedParams = await Promise.resolve(params);
	const { username } = resolvedParams;

	const decodedUsername = decodeURIComponent(username);

	const { data: profile, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", decodedUsername)
		.maybeSingle();

	if (error) {
		console.error("Error fetching profile:", error);
		return <div>Error loading profile.</div>;
	}

	if (!profile) {
		notFound();
	}

	// Fetch listings and posts counts here to pass to SellerProfileDetails
	const { count: listingsCount, error: listingsError } = await supabase
		.from("listings")
		.select("id", { count: "exact" })
		.eq("seller_id", profile.id);

	if (listingsError) {
		console.error("Error fetching listings count:", listingsError);
	}

	const { count: postsCount, error: postsError } = await supabase
		.from("posts")
		.select("id", { count: "exact" })
		.eq("user_id", profile.id);

	if (postsError) {
		console.error("Error fetching posts count:", postsError);
	}

	return (
		<div className='h-screen'>
			<SellerProfileTopSection profile={profile} />
			<SellerProfileDetails
				profile={profile}
				listingsCount={listingsCount || 0}
				postsCount={postsCount || 0}
			/>
		</div>
	);
}