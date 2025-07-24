"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react"; // NEW: Add useCallback
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { Profile } from "@/types";

interface AuthContextType {
	session: Session | null;
	user: User | null;
	profile: Profile | null;
	isLoading: boolean;
	signOut: () => Promise<void>;
	fetchProfile: () => Promise<void>; // NEW: Add fetchProfile to context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	const protectedRoutes = [
		"/dashboard",
		"/settings",
		"/create-listing",
		"/messages",
	];
	const isProtectedRoute = protectedRoutes.includes(pathname);

	// NEW: A function to fetch the profile, memoized with useCallback
	const fetchProfile = useCallback(
		async (userId?: string) => {
			const idToFetch = userId || user?.id; // Use passed userId or current user.id
			if (!idToFetch) {
				setProfile(null);
				return;
			}
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", idToFetch)
				.single();

			if (profileError) {
				console.error("Error fetching profile:", profileError.message);
				setProfile(null); // Ensure profile is null on error
			} else {
				setProfile(profileData);
			}
		},
		[user?.id]
	); // Depend on user.id to refetch if user changes

	useEffect(() => {
		const fetchInitialSessionAndProfile = async () => {
			setIsLoading(true);
			const {
				data: { session: currentSession },
			} = await supabase.auth.getSession();
			setSession(currentSession);
			setUser(currentSession?.user || null);

			if (currentSession?.user) {
				await fetchProfile(currentSession.user.id); // Fetch profile for initial session
			} else {
				setProfile(null); // Clear profile if no user
			}
			setIsLoading(false);

			// Client-side protection logic
			if (isProtectedRoute && !currentSession && pathname !== "/") {
				router.push("/");
			} else if (!isProtectedRoute && currentSession && pathname === "/") {
				router.push("/dashboard");
			}
		};

		fetchInitialSessionAndProfile(); // Initial fetch on mount

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, newSession) => {
			setSession(newSession);
			setUser(newSession?.user || null);

			if (newSession?.user) {
				await fetchProfile(newSession.user.id); // Fetch profile on auth state change
			} else {
				setProfile(null); // Clear profile if no user
			}
			setIsLoading(false);

			// Client-side protection logic on auth change
			if (isProtectedRoute && !newSession && pathname !== "/") {
				router.push("/");
			} else if (!isProtectedRoute && newSession && pathname === "/") {
				router.push("/dashboard");
			}
		});

		return () => subscription.unsubscribe();
	}, [router, pathname, isProtectedRoute, fetchProfile]); // Add fetchProfile to dependencies

	const signOut = async () => {
		setIsLoading(true); // Set loading while signing out
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error.message);
			setIsLoading(false); // Reset loading on error
			return;
		}
		// onAuthStateChange listener will handle updating session/user/profile to null and redirecting
	};

	const value = { session, user, profile, isLoading, signOut, fetchProfile }; // NEW: Include fetchProfile in value

	return (
		<AuthContext.Provider value={value}>
			{isLoading ? (
				<div className='flex min-h-screen items-center justify-center'>
					<p>Loading user session and profile...</p>
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
