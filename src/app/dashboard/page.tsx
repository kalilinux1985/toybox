// app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Database } from "@/lib/database.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";
import ListingDetailsPage from "../listing/[id]/page";

// Define a type for posts fetched with related profiles, comments count, and likes count
type PostWithAggregates = Database["public"]["Tables"]["posts"]["Row"] & {
	profiles: Database["public"]["Tables"]["profiles"]["Row"];
	comments: { count: number }[];
	likes: { count: number }[];
};

export default function DashboardPage() {
	const { user, profile, isLoading: authLoading } = useAuth();
	const [posts, setPosts] = useState<PostWithAggregates[]>([]);
	const [isLoadingPosts, setIsLoadingPosts] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPosts = useCallback(async () => {
		setIsLoadingPosts(true);
		setError(null);
		try {
			const { data, error: fetchError } = await supabase
				.from("posts")
				.select(
					`
                    *,
                    profiles!posts_user_id_fkey(*),
                    comments!comments_post_id_fkey(count),
                    likes!likes_post_id_fkey(count)
                `
				)
				.order("created_at", { ascending: false });

			if (fetchError) {
				console.error("Error fetching posts:", fetchError);
				throw new Error("Failed to fetch posts: " + fetchError.message); // Added error message
			}

			setPosts(data as PostWithAggregates[]);
			toast.success("Posts loaded successfully!");
		} catch (err: any) {
			setError(err.message);
			toast.error(
				err.message || "An unexpected error occurred while loading posts."
			);
		} finally {
			setIsLoadingPosts(false);
		}
	}, []);

	useEffect(() => {
		if (!authLoading) {
			fetchPosts();
		}
	}, [authLoading, fetchPosts]);

	const handlePostCreated = useCallback(() => {
		fetchPosts();
	}, [fetchPosts]);

	const canComment =
		!authLoading &&
		!!user &&
		(profile?.is_seller === false || profile?.is_premium_seller === true);

	if (authLoading || isLoadingPosts) {
		return (
			<div className='flex justify-center items-center min-h-[calc(100vh-64px)]'>
				<Loader2 className='h-10 w-10 animate-spin text-primary-violet' />
				<span className='ml-3 text-lg text-gray-700'>Loading dashboard...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto p-6 text-center'>
				<Card className='p-6 bg-card-bg border'>
					<CardHeader>
						<CardTitle className='text-red-700'>Error Loading Posts</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-red-600'>{error}</p>
						<Button
							onClick={fetchPosts}
							className='mt-4'>
							Try Again
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='container w-full flex justify-center mx-auto p-6 md:p-8 lg:p-10'>
			<div className="w-4/6 flex flex-col">
				<h1 className='text-3xl font-bold text-violet-600 mb-8'>
					Activity Feed
				</h1>

				<CreatePostForm onPostCreated={handlePostCreated} />

				<section className='mb-8'>
					<Card className=' bg-card-bg shadow-lg border'>
						<CardHeader className='pb-4'>
							<CardTitle className='text-2xl font-semibold text-slate-300'>
								Recent Posts
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{posts.length === 0 ? (
								<div className='text-center py-8'>
									<p className='text-gray-500 text-lg'>
										No posts yet. Be the first to share something!
									</p>
								</div>
							) : (
								<div className='grid gap-6'>
									{posts.map((post) => (
										<PostCard
											key={post.id}
											authorName={post.profiles?.full_name || "Unknown User"}
											authorAvatarSrc={
												post.profiles?.avatar_url ||
												"https://testingbot.com/free-online-tools/random-avatar/300"
											}
											authorTitle={
												post.profiles?.is_seller
													? post.profiles?.is_premium_seller
														? "Premium Seller"
														: "Seller"
													: "Buyer"
											}
											postTime={new Date(post.created_at).toLocaleString()}
											postText={post.content || ""}
											postImageSrc={post.image_url || undefined}
											likesCount={post.likes?.[0]?.count || 0}
											commentsCount={post.comments?.[0]?.count || 0}
											canComment={canComment}
											postId={post.id}
										/>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</section>

				{profile?.is_seller && (
					<Card className='bg-card-bg shadow-lg border mt-6'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
							<CardTitle className='text-2xl font-semibold text-slate-300'>
								Your Listings
							</CardTitle>
							<Button
								asChild
								className='flex items-center gap-2'>
								<Link href='/create-listing'>
									<PlusCircle className='h-4 w-4' />
									Create New Listing
								</Link>
							</Button>
						</CardHeader>
						<CardContent className='p-4'>
							<ListingDetailsPage />
							{/* <p className='text-gray-500'>
								This section is reserved for your product listings.
								<br />
								(You previously had a list of listings here; that logic would go
								here if needed.)
							</p> */}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
