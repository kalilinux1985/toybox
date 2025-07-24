// components/CreatePostForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Profile } from "@/types"; // Assuming Profile type is defined here or from database.types
import Link from "next/link";

interface CreatePostFormProps {
	onPostCreated: () => void; // Callback to refresh posts on dashboard
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
	const { user, profile, isLoading: authLoading } = useAuth();
	const [postContent, setPostContent] = useState("");
	const [postImage, setPostImage] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);

	// Determine if the current user can create a post
	const canCreatePost =
		!authLoading &&
		user &&
		(profile?.is_seller === false || profile?.is_premium_seller === true);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast.error("Please upload an image file.");
				setPostImage(null);
				setImagePreviewUrl(null);
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				toast.error("Image size must be less than 5MB.");
				setPostImage(null);
				setImagePreviewUrl(null);
				return;
			}
			setPostImage(file);
			setImagePreviewUrl(URL.createObjectURL(file));
		} else {
			setPostImage(null);
			setImagePreviewUrl(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user || !canCreatePost || isSubmitting) return;

		// Prevent rapid successive submissions (debounce)
		const now = Date.now();
		if (now - lastSubmissionTime < 2000) { // 2 second cooldown
			toast.error("Please wait a moment before submitting another post.");
			return;
		}
		setLastSubmissionTime(now);

		if (!postContent.trim() && !postImage) {
			toast.error("Post cannot be empty. Please add text or an image.");
			return;
		}

		setIsSubmitting(true);
		let imageUrl: string | null = null;

		try {
			// Add a small delay to prevent rapid duplicate submissions
			await new Promise(resolve => setTimeout(resolve, 100));
			
			// Ensure user profile exists before creating post
			const { data: profileCheck, error: profileError } = await supabase
				.from("profiles")
				.select("id")
				.eq("id", user.id)
				.single();
			
			if (profileError || !profileCheck) {
				// Create profile if it doesn't exist
				const { error: createProfileError } = await supabase.from("profiles").insert({
					id: user.id,
					username: user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`,
				});
				if (createProfileError) {
					throw new Error("Failed to create user profile. Please try again.");
				}
			}
			
			if (postImage) {
					const fileExt = postImage.name.split(".").pop();
					const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
					const { data, error: uploadError } = await supabase.storage
					.from("post-images") // Use your new bucket name
					.upload(fileName, postImage, {
						cacheControl: "3600",
						upsert: false,
					});

				if (uploadError) {
					console.error("Error uploading image:", uploadError);
					throw new Error("Failed to upload image.");
				}

				// Construct the public URL for the uploaded image
				const { data: publicUrlData } = supabase.storage
					.from("post-images")
					.getPublicUrl(data.path);
				imageUrl = publicUrlData.publicUrl;
			}

			// Check for duplicate content before inserting
			const trimmedContent = postContent.trim();
			if (trimmedContent) {
				const { data: existingPosts } = await supabase
					.from("posts")
					.select("id")
					.eq("user_id", user.id)
					.eq("content", trimmedContent)
					.gte("created_at", new Date(Date.now() - 60000).toISOString()); // Check last minute
				
				if (existingPosts && existingPosts.length > 0) {
					throw new Error("You've already posted this content recently. Please wait before posting the same content again.");
				}
			}

			const { error: postError } = await supabase.from("posts").insert({
				user_id: user.id,
				content: trimmedContent,
				image_url: imageUrl,
			});

			if (postError) {
				console.error("Error creating post:", postError);
				// Handle specific foreign key constraint violation
				if (postError.code === '23503') {
					throw new Error("User profile not found. Please refresh the page and try again.");
				}
				// Handle specific HTTP 409 conflict error
				if (postError.code === '23505' || postError.message?.includes('duplicate') || postError.message?.includes('conflict')) {
					throw new Error("This post already exists or conflicts with an existing post. Please try again with different content.");
				}
				throw new Error(`Failed to create post: ${postError.message || 'Unknown error'}`);
			}

			toast.success("Post created successfully!");
			setPostContent("");
			setPostImage(null);
			setImagePreviewUrl(null);
			onPostCreated(); // Call callback to refresh dashboard posts
		} catch (error: any) {
			toast.error(error.message || "An unexpected error occurred.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (authLoading) {
		return (
			<Card className='shadow-lg p-6 flex justify-center items-center h-32'>
				<Loader2 className='h-6 w-6 animate-spin text-blue-500' />
				<span className='ml-2 text-gray-600'>Loading user data...</span>
			</Card>
		);
	}

	// Render nothing if user cannot create posts (not logged in or not allowed role)
	if (!canCreatePost) {
		return (
			<Card className='p-6 text-center shadow-lg'>
				<CardHeader>
					<CardTitle className='text-2xl font-semibold text-gray-800'>
						Join the conversation!
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4 text-gray-600'>
						You need to be logged in to create posts or comments. If you're a
						seller, only premium sellers can create posts.
					</p>
					<Button asChild>
						<Link href='/login'>Login or Sign Up</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='shadow-lg border bg-card-bg mb-6'>
			<CardHeader className='pb-4'>
				<CardTitle className='text-xl font-semibold text-slate-300'>
					Create a New Post
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<Textarea
						placeholder="What's on your mind?"
						value={postContent}
						onChange={(e) => setPostContent(e.target.value)}
						rows={3}
						className='resize-y min-h-[80px]'
						disabled={isSubmitting}
					/>
					{imagePreviewUrl && (
						<div className='relative w-32 h-32 overflow-hidden'>
							<img
								src={imagePreviewUrl}
								alt='Image preview'
								className='object-cover w-full h-full'
							/>
							<Button
								type='button'
								variant='destructive'
								size='sm'
								className='absolute top-1 right-1 h-6 w-6 p-0'
								onClick={() => {
									setPostImage(null);
									setImagePreviewUrl(null);
								}}>
								X
							</Button>
						</div>
					)}
					<div className='flex justify-between items-center'>
						<label
							htmlFor='post-image-upload'
							className='cursor-pointer text-slate-300 hover:text-violet-600
							 flex items-center gap-2'>
							<ImageIcon className='h-5 w-5' />
							<span>Add Image</span>
							<input
								id='post-image-upload'
								type='file'
								accept='image/*'
								className='hidden'
								onChange={handleFileChange}
								disabled={isSubmitting}
							/>
						</label>
						<Button
							type='submit'
							disabled={isSubmitting || (!postContent.trim() && !postImage)}
							className='text-slate-300 hover:text-violet-600'>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Posting...
								</>
							) : (
								<>
									<Send className='mr-2 h-4 w-4' />
									Post
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
