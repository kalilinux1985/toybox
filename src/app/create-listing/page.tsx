"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Profile } from "@/types"; // Import Profile type
import { Category } from "@/types"; // We'll add this type soon

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to add this shadcn component
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"; // Need to add this shadcn component
import Image from "next/image"; // For image previews
import { Loader2, PlusCircle, XCircle } from "lucide-react"; // For icons, need to install lucide-react

export default function CreateListingPage() {
	const { user, profile, isLoading: authLoading } = useAuth();
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [condition, setCondition] = useState("");
	const [images, setImages] = useState<File[]>([]); // Array to hold File objects
	const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Array to hold Data URLs for previews

	const [categories, setCategories] = useState<Category[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	// --- Fetch Categories on Mount ---
	useEffect(() => {
		const fetchCategories = async () => {
			const { data, error } = await supabase.from("categories").select("*");
			if (error) {
				console.error("Error fetching categories:", error);
				toast.error("Error", { description: "Failed to load categories." });
			} else {
				setCategories(data || []);
			}
		};
		fetchCategories();
	}, []);

	// --- Redirect if not authenticated or not a seller ---
	useEffect(() => {
		if (!authLoading) {
			if (!user) {
				toast.warning("Access Denied", {
					description: "Please sign in to create a listing.",
				});
				router.push("/");
			} else if (!profile?.is_seller && !profile?.is_premium_seller) {
				toast.warning("Permission Denied", {
					description:
						"You must be a seller to create listings. Update your profile in settings.",
				});
				router.push("/dashboard"); // Redirect if not a seller
			}
		}
	}, [user, profile, authLoading, router]);

	// --- Handle Image File Selection ---
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			// Limit to max 5 images
			if (images.length + newFiles.length > 5) {
				toast.error("Image Limit", {
					description: "You can upload a maximum of 5 images.",
				});
				return;
			}
			setImages((prev) => [...prev, ...newFiles]);

			// Create previews
			const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
			setImagePreviews((prev) => [...prev, ...newPreviews]);
		}
	};

	// --- Remove Image ---
	const removeImage = (indexToRemove: number) => {
		setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
		setImagePreviews((prev) =>
			prev.filter((_, index) => index !== indexToRemove)
		);
	};

	// --- Handle Form Submission ---
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		setIsSubmitting(true);

		if (!user || (!profile?.is_seller && !profile?.is_premium_seller)) {
			setFormError("You must be logged in and a seller to create a listing.");
			setIsSubmitting(false);
			return;
		}

		if (images.length === 0) {
			setFormError("Please upload at least one image for your listing.");
			setIsSubmitting(false);
			return;
		}

		try {
			// 1. Insert Listing Data
			const { data: listing, error: listingError } = await supabase
				.from("listings")
				.insert({
					seller_id: user.id,
					category_id: selectedCategoryId,
					title,
					description,
					price: parseFloat(price),
					condition,
					currency: "USD", // Default currency for now
					status: "active",
				})
				.select()
				.single();

			if (listingError) {
				throw new Error(`Listing creation failed: ${listingError.message}`);
			}

			// 2. Upload Images to Storage
			const imageUrls: string[] = [];
			for (const [index, file] of images.entries()) {
				const fileExtension = file.name.split(".").pop();
				const filePath = `${user.id}/${
					listing.id
				}/${Date.now()}-${index}.${fileExtension}`;
				const { error: uploadError } = await supabase.storage
					.from("listing-images")
					.upload(filePath, file, {
						cacheControl: "3600",
						upsert: false, // Don't overwrite existing files
					});

				if (uploadError) {
					console.error(`Error uploading image ${file.name}:`, uploadError);
					// Consider rolling back listing creation here, or marking it as draft
					throw new Error(
						`Image upload failed for ${file.name}: ${uploadError.message}`
					);
				}

				// Get public URL
				const { data: publicUrlData } = supabase.storage
					.from("listing-images")
					.getPublicUrl(filePath);

				if (publicUrlData) {
					imageUrls.push(publicUrlData.publicUrl);
				}
			}

			// 3. Insert Image URLs into listing_images table
			const imageInserts = imageUrls.map((url, index) => ({
				listing_id: listing.id,
				image_url: url,
				sort_order: index,
			}));

			const { error: imageInsertError } = await supabase
				.from("listing_images")
				.insert(imageInserts);

			if (imageInsertError) {
				throw new Error(
					`Image record insertion failed: ${imageInsertError.message}`
				);
			}

			toast.success("Listing created successfully!", {
				description: "Your item is now live for sale.",
			});
			router.push("/dashboard"); // Or redirect to the new listing's page
		} catch (error: any) {
			console.error("Error creating listing:", error);
			setFormError(
				error.message || "An unexpected error occurred during listing creation."
			);
			toast.error("Listing Creation Failed", {
				description: error.message || "Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (authLoading || (!user && !authLoading) || (!profile && !authLoading)) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin mr-2' />
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-6'>
			<Card className='w-full bg-card-bg border max-w-2xl'>
				<CardHeader>
					<CardTitle>Create New Listing</CardTitle>
					<CardDescription>
						Fill out the details for your item, including photos.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{formError && (
						<div
							className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
							role='alert'>
							<span className='block sm:inline'>{formError}</span>
						</div>
					)}
					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						<div className='grid gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='title'>Title</Label>
								<Input
									id='title'
									placeholder='e.g., Well-worn blue panties'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									maxLength={100}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									placeholder='Describe your item in detail...'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
									minLength={20}
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='price'>Price (USD)</Label>
									<Input
										id='price'
										type='number'
										placeholder='e.g., 25.00'
										value={price}
										onChange={(e) => setPrice(e.target.value)}
										required
										min='0.01'
										step='0.01'
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='category'>Category</Label>
									<Select
										value={selectedCategoryId}
										onValueChange={setSelectedCategoryId}
										required>
										<SelectTrigger
											id='category'
											className='custom-select'>
											<SelectValue placeholder='Select a category' />
										</SelectTrigger>
										<SelectContent>
											{categories.map((cat) => (
												<SelectItem
													key={cat.id}
													value={cat.id}
													className='select-item'>
													{cat.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='condition'>
									Condition (e.g., lightly_worn, moderately_worn, well_worn)
								</Label>
								<Input
									id='condition'
									placeholder='e.g., well_worn'
									value={condition}
									onChange={(e) => setCondition(e.target.value)}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='images'>Images (Max 5)</Label>
								<Input
									id='images'
									type='file'
									multiple
									accept='image/*'
									onChange={handleImageChange}
									className='cursor-pointer'
									disabled={images.length >= 5}
								/>
								{images.length === 0 && (
									<p className='text-sm text-gray-500'>
										Upload at least one image.
									</p>
								)}
								{imagePreviews.length > 0 && (
									<div className='grid grid-cols-3 gap-2 mt-4'>
										{imagePreviews.map((src, index) => (
											<div
												key={index}
												className='relative w-full h-24 overflow-hidden rounded-md border border-gray-200'>
												<Image
													src={src}
													alt={`Preview ${index}`}
													fill
													style={{ objectFit: "cover" }}
												/>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													className='absolute top-1 right-1 h-6 w-6 rounded-full bg-background/50 hover:bg-background/70 text-red-500 hover:text-red-600'
													onClick={() => removeImage(index)}>
													<XCircle className='h-4 w-4' />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<Button
							type='submit'
							className='w-full'
							disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									Creating Listing...
								</>
							) : (
								"Create Listing"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
