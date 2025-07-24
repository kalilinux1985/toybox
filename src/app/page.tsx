"use client"; // Needs to be client component to use useAuth

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import HomePageContent from "@/components/home-page-content";

export default function HomePage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// We only want to redirect if loading is complete and we have a user.
		if (!isLoading && user) {
			router.push("/dashboard");
		}
	}, [user, isLoading, router]);

	return (
		<HomePageContent
			user={user}
			isLoading={isLoading}
		/>
	);
}
