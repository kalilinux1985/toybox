// src/app/listing/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ListingWithDetails = Listing & {
	profiles: { username: string } | null;
	listing_images: { image_url: string; sort_order: number }[];
};

export default function ListingDetailsPage() {
	const params = useParams(); // Hook to get dynamic route parameters
	const router = useRouter();
	const listingId = params.id as string; // Get the 'id' from the URL

	const [listing, setListing] = useState<ListingWithDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!listingId) return; // Don't fetch if id is not available yet

		const fetchListing = async () => {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("listings")
				.select(`*, profiles(username), listing_images(image_url, sort_order)`)
				.eq("id", listingId)
				.single(); // Use .single() as we expect only one listing

			if (error) {
				console.error("Error fetching listing:", error);
				setError("Failed to load listing details.");
				toast.error("Listing Error", {
					description: "Could not load listing details.",
				});
				setListing(null);
			} else if (!data) {
				setError("Listing not found.");
				toast.warning("Not Found", {
					description: "The listing you are looking for does not exist.",
				});
				setListing(null);
			} else {
				// Sort images by sort_order
				const sortedImages = data.listing_images
					? (
							data.listing_images as { image_url: string; sort_order: number }[]
					  ).sort((a, b) => a.sort_order - b.sort_order)
					: [];
				setListing({ ...data, listing_images: sortedImages });
			}
			setIsLoading(false);
		};

		fetchListing();
	}, [listingId]); // Re-run effect if listingId changes

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin mr-2' />
				<p>Loading listing details...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50'>
				<Card className='w-full max-w-xl text-center p-8'>
					<CardTitle className='text-2xl font-bold mb-4'>Error</CardTitle>
					<CardDescription className='text-red-500 mb-6'>
						{error}
					</CardDescription>
					<Button onClick={() => router.back()}>Go Back</Button>
					<Button
						asChild
						className='ml-4'>
						<Link href='/'>Go to Home</Link>
					</Button>
				</Card>
			</div>
		);
	}

	if (!listing) {
		// This case should ideally be caught by error handling above, but as a fallback
		return (
			<div className='flex min-h-screen flex-col items-center justify-center p-6'>
				<Card className='w-full max-w-xl text-center p-8'>
					<CardTitle className='text-2xl font-bold mb-4'>
						Listing Not Found
					</CardTitle>
					<Button onClick={() => router.back()}>Go Back</Button>
					<Button
						asChild
						className='ml-4'>
						<Link href='/'>Go to Home</Link>
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<main className='flex min-h-screen flex-col items-center lg:m-5 lg:p-6'>
			<Card className='w-full bg-card-bg border max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:p-6'>
				<div className='md:col-span-1 mt-0 pt-0'>
					{listing.listing_images && listing.listing_images.length > 0 ? (
						<div className='relative w-full mt-0 pt-0 aspect-square overflow-hidden'>
							<Image
								src={listing.listing_images[0].image_url} // Display the first image
								alt={listing.title}
								fill
								style={{ objectFit: "cover" }} // Use 'contain' for full image visibility
								className='mt-0 pt-0'
							/>
						</div>
					) : (
						<div className='w-full aspect-square flex items-center justify-center text-slate-300'>
							No Image Available
						</div>
					)}
					{/* Add a gallery for multiple images here if you have them */}
					{listing.listing_images && listing.listing_images.length > 1 && (
						<div className='grid grid-cols-4 gap-2 pt-0 mt-0 lg:mt-2'>
							{listing.listing_images.slice(1).map((img, index) => (
								<div
									key={index}
									className='relative w-full aspect-square overflow-hidden cursor-pointer'>
									<Image
										src={img.image_url}
										alt={`${listing.title} image ${index + 2}`}
										fill
										style={{ objectFit: "cover" }}
										className='rounded-[5px] mt-0 pt-0'
									/>
								</div>
							))}
						</div>
					)}
				</div>

				<div className='md:col-span-1 space-y-4'>
					<CardHeader className='pt-0 mt-0'>
						<CardTitle className='text-3xl font-bold text-violet-600'>
							{listing.title}
						</CardTitle>
						<CardDescription className='text-2xl text-primary font-semibold'>
							{listing.currency} {listing.price.toFixed(2)}
						</CardDescription>
					</CardHeader>
					<CardContent className='p-6 space-y-3'>
						<p className='text-slate-200'>**Description:**</p>
						<p className='text-slate-300 leading-relaxed whitespace-pre-wrap'>
							{listing.description}
						</p>
						<p className='text-gray-700'>
							**Condition:**{" "}
							<span className='font-medium capitalize'>
								{listing.condition.replace(/_/g, " ")}
							</span>
						</p>
						<p className='text-gray-700'>
							**Seller:**{" "}
							<span className='font-medium'>
								{listing.profiles?.username || "N/A"}
							</span>
						</p>
						<p className='text-gray-700'>
							**Listed On:**{" "}
							<span className='font-medium'>
								{new Date(listing.created_at).toLocaleDateString()}
							</span>
						</p>
					</CardContent>
					<div className='pt-4'>
						<Button className='w-full'>
							Buy Now {/* Placeholder for purchase functionality */}
						</Button>
						{/* Add "Message Seller" or "Add to Cart" buttons here */}
					</div>
				</div>
			</Card>
		</main>
	);
}
