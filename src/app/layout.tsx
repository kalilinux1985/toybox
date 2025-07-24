"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";

import { useRouter, usePathname } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<AuthProvider>
					<LayoutContent>{children}</LayoutContent>
				</AuthProvider>
				<Toaster
					position='bottom-right'
					richColors
				/>
			</body>
		</html>
	);
}

function LayoutContent({ children }: { children: React.ReactNode }) {
	const { user, profile, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	const noSidebarRoutes = ["/", "/login", "/signup"];

	const showSidebar = !isLoading && user && !noSidebarRoutes.includes(pathname);

	const getSidebarCurrentPage = (): Parameters<
		typeof LeftSidebar
	>[0]["currentPage"] => {
		if (pathname.startsWith("/dashboard")) return "dashboard";
		if (pathname.startsWith("/listings")) return "listings";
		if (pathname.startsWith("/messages")) return "messages";
		if (pathname.startsWith("/profile")) return "profile";
		if (pathname.startsWith("/settings")) return "settings";
		return "dashboard";
	};

	const handleNavigate = (
		page: "dashboard" | "listings" | "messages" | "profile" | "settings"
	) => {
		switch (page) {
			case "dashboard":
				router.push("/dashboard");
				break;
			case "listings":
				router.push("/listings");
				break;
			case "messages":
				router.push("/messages");
				break;
			case "profile":
				if (profile?.is_seller && profile?.username) {
					router.push(`/profile/${profile.username}`);
				} else if (!profile?.is_seller && profile?.username) {
					router.push(`/profile/${profile.username}`);
				} else {
					router.push("/dashboard");
					console.warn("Could not determine profile type for navigation.");
				}
				break;
			case "settings":
				router.push("/settings");
				break;
			default:
				router.push("/dashboard");
		}
	};

	return (
		<div className=' w-full flex relative min-h-screen'>
			{showSidebar && (
				<LeftSidebar
					handleNavigate={handleNavigate}
					currentPage={getSidebarCurrentPage()}

				/>
			)}
			<main className='w-full flex-1'>{children}</main>
		</div>
	);
}
