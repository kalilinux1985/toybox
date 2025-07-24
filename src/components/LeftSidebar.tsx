"use client";

import React, { useState, useEffect } from "react";
import {
	Home,
	Tag,
	MessageSquare,
	User,
	Settings,
	LogOut,
	Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LeftSidebarProps {
	handleNavigate: (
		page: "dashboard" | "listings" | "messages" | "profile" | "settings"
	) => void;
	currentPage: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
	handleNavigate,
	currentPage,
}) => {
	const { user, profile, signOut, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const [displayUsername, setDisplayUsername] = useState("");
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfileData = async () => {
			if (user && profile) {
				setDisplayUsername(profile.username || "User");
				setAvatarUrl(profile.avatar_url);
			} else {
				setDisplayUsername("Guest");
				setAvatarUrl(null);
			}
		};

		if (!authLoading) {
			fetchProfileData();
		}
	}, [user, profile, authLoading]);

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Logged out successfully!");
			router.push("/");
		} catch (error: any) {
			console.error("Sign out error:", error);
			toast.error(error.message || "Failed to sign out.");
		}
	};

	const menuItems = [
		{ name: "Dashboard", icon: Home, page: "dashboard" },
		{ name: "Listings", icon: Tag, page: "listings" },
		{ name: "Messages", icon: MessageSquare, page: "messages" },
		{ name: "Profile", icon: User, page: "profile" },
	];

	const getLinkStyle = (page: string) => {
		return currentPage === page
			? "bg-primary-violet text-white"
			: "text-muted-foreground hover:bg-muted/50 hover:text-primary-violet";
	};

	if (authLoading) {
		return (
			<Card className='p-4 flex flex-col items-center justify-center h-48'>
				<Loader2 className='h-8 w-8 animate-spin text-primary-violet' />
				<span className='mt-2 text-gray-600'>Loading sidebar...</span>
			</Card>
		);
	}

	return (
		<Card className='hidden md:block p-4 border shadow-lg bg-card-bg h-fit'>
			<div className='card-header text-center border-bottom pb-4 mb-4 border-b border-border-default'>
				<Avatar className='w-42 h-42 mx-auto rounded-[5px] mb-3'>
					<AvatarImage
						src={
							avatarUrl ||
							"https://testingbot.com/free-online-tools/random-avatar/300"
						}
						alt={displayUsername}
					/>
					<AvatarFallback>
						{displayUsername.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<h5 className='mb-0 text-lg font-semibold text-text-default'>
					{displayUsername}
				</h5>
				{profile && (
					<p className='mb-0 text-sm text-muted-foreground'>
						{profile.is_seller
							? profile.is_premium_seller
								? "Premium Seller"
								: "Seller"
							: "Buyer"}
					</p>
				)}
			</div>

			<div className='card-body p-0'>
				<ul className='nav flex-column mb-4'>
					{menuItems.map((item) => (
						<li
							key={item.name}
							className='nav-item'>
							<a
								href='#'
								onClick={(e) => {
									e.preventDefault();
									handleNavigate(
										item.page as Parameters<typeof handleNavigate>[0]
									);
								}}
								className={`flex items-center p-2 rounded-md transition-colors duration-200 ${getLinkStyle(
									item.page
								)}`}>
								<item.icon className='me-2 h-5 w-5' />
								<span>{item.name}</span>
							</a>
						</li>
					))}

					{profile?.is_seller && (
						<li
							key='seller-settings'
							className='nav-item'>
							<a
								href='#'
								onClick={(e) => {
									e.preventDefault();
									handleNavigate("settings");
								}}
								className={`flex items-center p-2 rounded-md transition-colors duration-200 ${getLinkStyle(
									"settings"
								)}`}>
								<Settings className='me-2 h-5 w-5' />
								<span>Seller Settings</span>
							</a>
						</li>
					)}
				</ul>
			</div>

			<div className='hover:text-violet-500 hover:bg-rose-400 card-bg card-footer text-center py-2 bg-card-bg rounded-5px mb-4 border-none'>
				<Button
					variant='ghost'
					className='w-full justify-start text-red-500 hover:text-red-700'
					onClick={handleSignOut}>
					<LogOut className='me-2 h-5 w-5' />
					Sign Out
				</Button>
			</div>
		</Card>
	);
};

export default LeftSidebar;
