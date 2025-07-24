// components/PostCard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
	Bookmark,
	MessageSquare,
	MoreHorizontal,
	Share2,
	ThumbsUp,
	Link,
	Send,
} from "lucide-react"; // Make sure to import all used icons

interface PostCardProps {
	postId: string; // New prop for the post ID
	authorName: string;
	authorAvatarSrc: string;
	authorTitle: string;
	postTime: string;
	postText: string;
	postImageSrc?: string; // Optional image source
	likesCount: number;
	commentsCount: number;
	canComment: boolean; // New prop to control comment input visibility
}

export default function PostCard({
	postId,
	authorName,
	authorAvatarSrc,
	authorTitle,
	postTime,
	postText,
	postImageSrc,
	likesCount,
	commentsCount,
	canComment,
}: PostCardProps) {
	const [showComments, setShowComments] = useState(false);

	const toggleComments = () => {
		setShowComments(!showComments);
	};

	return (
		<Card className='w-full bg-card-bg border'>
			{/* Card header START */}
			<CardHeader className='border-b-0 pb-0'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center'>
						{/* Avatar */}
						<Avatar className='w-10 h-10 mr-2 rounded-[5px] ring-2 ring-primary-violet'>
							<a href='#!'>
								<AvatarImage
									src={authorAvatarSrc}
									alt={authorName}
								/>
								<AvatarFallback>
									{authorName.charAt(0).toUpperCase()}
								</AvatarFallback>
							</a>
						</Avatar>
						{/* Info */}
						<div>
							<div className='flex items-center space-x-2 text-sm'>
								<h6 className='font-semibold text-text-default'>
									<a href='#!'>{authorName}</a>
								</h6>
								<span className='text-muted-foreground'> • {postTime}</span>
							</div>
							<p className='mb-0 text-sm text-muted-foreground'>
								{authorTitle}
							</p>
						</div>
					</div>
					{/* Card feed action dropdown START */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='h-8 w-8 p-0 text-muted-foreground hover:bg-muted-foreground/10'>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-48 bg-card-bg border-[1px] border-border-default rounded-md shadow-lg'>
							<DropdownMenuItem className='flex items-center px-4 py-2 hover:bg-muted/50 cursor-pointer'>
								<Bookmark className='mr-2 h-4 w-4' /> Save Post
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{/* Card feed action dropdown END */}
				</div>
			</CardHeader>
			{/* Card header END */}

			{/* Card body START */}
			<CardContent className='p-4 pt-0'>
				<p className='mb-4 text-text-default'>{postText}</p>
				{/* Card img */}
				{postImageSrc && (
					<img
						className='w-full h-auto rounded-[5px] mb-4'
						src={postImageSrc}
						alt='Post'
					/>
				)}

				{/* Feed react START */}
				<ul className='flex py-3 text-sm border-b-[1px] border-border-default mb-3'>
					<li
						key='postcard-like'
						className='mr-4'>
						<a
							className='flex items-center text-text-default hover:text-primary-violet transition-colors'
							href='#!'>
							<ThumbsUp className='mr-2 h-5 w-5' />
							Liked ({likesCount})
						</a>
					</li>
					<li
						key='postcard-comment'
						className='mr-4'>
						<a
							className='flex items-center text-text-default hover:text-primary-violet transition-colors cursor-pointer'
							href='#!'
							onClick={toggleComments}>
							<MessageSquare className='mr-2 h-5 w-5' />
							Comments ({commentsCount})
						</a>
					</li>
					{/* Card share action START */}
					<li
						key='postcard-share'
						className='ml-auto relative'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<a className='flex items-center text-text-default hover:text-primary-violet transition-colors cursor-pointer'>
									<Share2 className='mr-2 h-5 w-5' />
									Share ({sharesCount})
								</a>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-48 bg-card-bg border-[1px] border-border-default rounded-md shadow-lg'>
								<DropdownMenuItem className='flex items-center px-4 py-2 hover:bg-muted/50 cursor-pointer'>
									<Link className='mr-2 h-4 w-4' /> Copy link to post
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</li>
					{/* Card share action END */}
				</ul>
				{/* Feed react END */}

				{/* Comments Section - Conditionally rendered */}
				{showComments && (
					<>
						{/* Add comment */}
						{canComment && ( // <-- Conditional rendering based on canComment prop
							<div className='flex mb-3 items-center'>
								{/* Avatar */}
								<Avatar className='w-8 h-8 mr-2 rounded-[5px]'>
									<a href='#!'>
										<AvatarImage
											src='https://testingbot.com/free-online-tools/random-avatar/300' // TODO: Replace with dynamic user avatar
											alt='User Avatar'
										/>
										<AvatarFallback>U</AvatarFallback>
									</a>
								</Avatar>
								{/* Comment box */}
								<form className='relative w-full'>
									<Textarea
										className='w-full pr-12 bg-muted rounded-md resize-none focus:outline-none'
										rows={1}
										placeholder='Add a comment...'></Textarea>
									<Button
										variant='ghost'
										type='submit'
										className='absolute top-1/2 right-0 -translate-y-1/2 p-2 h-auto text-muted-foreground hover:bg-transparent'>
										<Send className='h-5 w-5' />
									</Button>
								</form>
							</div>
						)}
						{/* Comment wrap START */}
						<ul className='list-none p-0'>
							{/* Comment item START */}
							<li
								key='comment-1'
								className='mb-4'>
								<div className='flex relative'>
									{/* Avatar */}
									<Avatar className='w-8 h-8 mr-2 rounded-[5px]'>
										<a href='#!'>
											<AvatarImage
												src='https://testingbot.com/free-online-tools/random-avatar/300'
												alt='Commenter Avatar'
											/>
											<AvatarFallback>FG</AvatarFallback>
										</a>
									</Avatar>
									<div className='flex-1'>
										{/* Comment by */}
										<div className='bg-muted p-3 rounded-lg rounded-bl-none text-text-default'>
											<div className='flex justify-between items-center'>
												<h6 className='font-semibold text-text-default'>
													<a href='#!'> Frances Guerrero </a>
												</h6>
												<small className='ml-2 text-muted-foreground'>
													5hr
												</small>
											</div>
											<p className='small mb-0 text-sm'>
												Removed demands expense account in outward tedious do.
												Particular way thoroughly unaffected projection.
											</p>
										</div>
										{/* Comment react */}
										<ul className='flex space-x-4 py-2 text-xs text-muted-foreground'>
											<li key='like-btn-1'>
												<a
													className='hover:text-primary-violet'
													href='#!'>
													{" "}
													Like (3)
												</a>
											</li>
											<li key='reply-btn-1'>
												<a
													className='hover:text-primary-violet'
													href='#!'>
													{" "}
													Reply
												</a>
											</li>
											<li key='view-replies-btn-1'>
												<a
													className='hover:text-primary-violet'
													href='#!'>
													{" "}
													View 5 replies
												</a>
											</li>
										</ul>
									</div>
								</div>
								{/* Comment item nested START */}
								<ul className='list-none p-0 pl-10 mt-2'>
									{/* Comment item START */}
									<li
										key='comment-1-reply-1'
										className='mb-4'>
										<div className='flex'>
											{/* Avatar */}
											<Avatar className='w-8 h-8 mr-2 rounded-[5px]'>
												<a href='#!'>
													<AvatarImage
														src='https://testingbot.com/free-online-tools/random-avatar/300'
														alt='Replyer Avatar'
													/>
													<AvatarFallback>LS</AvatarFallback>
												</a>
											</Avatar>
											{/* Comment by */}
											<div className='flex-1'>
												<div className='bg-muted p-3 rounded-lg rounded-bl-none text-text-default'>
													<div className='flex justify-between items-center'>
														<h6 className='mb-1 font-semibold text-text-default'>
															<a href='#!'> Lori Stevens </a>
														</h6>
														<small className='ml-2 text-muted-foreground'>
															2hr
														</small>
													</div>
													<p className='small mb-0 text-sm'>
														See resolved goodness felicity shy civility domestic
														had but Drawings offended yet answered Jennings
														perceive.
													</p>
												</div>
												{/* Comment react */}
												<ul className='flex space-x-4 py-2 text-xs text-muted-foreground'>
													<li key='like-btn-reply-1'>
														<a
															className='hover:text-primary-violet'
															href='#!'>
															{" "}
															Like (5)
														</a>
													</li>
													<li key='reply-btn-reply-1'>
														<a
															className='hover:text-primary-violet'
															href='#!'>
															{" "}
															Reply
														</a>
													</li>
												</ul>
											</div>
										</div>
									</li>
									{/* Comment item END */}
									{/* Comment item START */}
									<li
										key='comment-1-reply-2'
										className='mb-4'>
										<div className='flex'>
											{/* Avatar */}
											<Avatar className='w-8 h-8 mr-2 rounded-[5px]'>
												<a href='#!'>
													<AvatarImage
														src='https://testingbot.com/free-online-tools/random-avatar/300'
														alt='Replyer Avatar'
													/>
													<AvatarFallback>BV</AvatarFallback>
												</a>
											</Avatar>
											{/* Comment by */}
											<div className='flex-1'>
												<div className='bg-muted p-3 rounded-lg rounded-bl-none text-text-default'>
													<div className='flex justify-between items-center'>
														<h6 className='mb-1 font-semibold text-text-default'>
															<a href='#!'> Billy Vasquez </a>
														</h6>
														<small className='ml-2 text-muted-foreground'>
															15min
														</small>
													</div>
													<p className='small mb-0 text-sm'>
														Wishing calling is warrant settled was lucky.
													</p>
												</div>
												{/* Comment react */}
												<ul className='flex space-x-4 py-2 text-xs text-muted-foreground'>
													<li key='like-btn-reply-2'>
														<a
															className='hover:text-primary-violet'
															href='#!'>
															{" "}
															Like
														</a>
													</li>
													<li key='reply-btn-reply-2'>
														<a
															className='hover:text-primary-violet'
															href='#!'>
															{" "}
															Reply
														</a>
													</li>
												</ul>
											</div>
										</div>
									</li>
									{/* Comment item END */}
								</ul>
								{/* Load more replies */}
								<a
									href='#!'
									role='button'
									className='text-secondary-foreground hover:text-primary-violet flex items-center mb-3 ml-10 text-sm'>
									<div className='flex space-x-1 mr-2 animate-pulse'>
										<span className='w-1.5 h-1.5 bg-current rounded-full'></span>
										<span className='w-1.5 h-1.5 bg-current rounded-full'></span>
										<span className='w-1.5 h-1.5 bg-current rounded-full'></span>
									</div>
									Load more replies
								</a>
								{/* Comment item nested END */}
							</li>
							{/* Comment item END */}
							{/* Comment item START */}
							<li
								key='comment-2'
								className='mb-4'>
								<div className='flex'>
									{/* Avatar */}
									<Avatar className='w-8 h-8 mr-2 rounded-[5px]'>
										<a href='#!'>
											<AvatarImage
												src='https://testingbot.com/free-online-tools/random-avatar/300'
												alt='Commenter Avatar'
											/>
											<AvatarFallback>FG</AvatarFallback>
										</a>
									</Avatar>
									{/* Comment by */}
									<div className='flex-1'>
										<div className='bg-muted p-3 rounded-lg rounded-bl-none text-text-default'>
											<div className='flex justify-between items-center'>
												<h6 className='mb-1 font-semibold text-text-default'>
													<a href='#!'> Frances Guerrero </a>
												</h6>
												<small className='ml-2 text-muted-foreground'>
													4min
												</small>
											</div>
											<p className='small mb-0 text-sm'>
												Preference any astonished unreserved Mrs.
											</p>
										</div>
										{/* Comment react */}
										<ul className='flex space-x-4 py-2 text-xs text-muted-foreground'>
											<li key='like-btn-2'>
												<a
													className='hover:text-primary-violet'
													href='#!'>
													{" "}
													Like (5)
												</a>
											</li>
											<li key='reply-btn-2'>
												<a
													className='hover:text-primary-violet'
													href='#!'>
													{" "}
													Reply
												</a>
											</li>
										</ul>
									</div>
								</div>
							</li>
							{/* Comment item END */}
						</ul>
						{/* Comment wrap END */}
					</>
				)}
			</CardContent>
			{/* Card body END */}
		</Card>
	);
}
