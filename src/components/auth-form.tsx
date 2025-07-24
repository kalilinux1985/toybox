"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // NEW: Import toast from sonner

type AuthMode = "signin" | "signup";

export function AuthForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [userType, setUserType] = useState<"Seller" | "Buyer" | "">("");
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<AuthMode>("signin");
	const router = useRouter();
	// REMOVE THIS LINE: const { toast } = useToast(); // No longer needed

	const handleAuth = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);

		if (mode === "signup") {
			const { data, error } = await supabase.auth.signUp({ email, password });
			if (error) {
				toast.error("Authentication Error", { description: error.message });
			} else if (data.user) {
				// Create a profile for the new user
				const { error: profileError } = await supabase.from("profiles").insert({
					id: data.user.id,
					username: username,
					is_seller: userType === "Seller",
				});
				if (profileError) {
					toast.error("Failed to create profile", {
						description: profileError.message,
					});
				} else {
					toast.success("Success!", {
						description: "Check your email for confirmation (if enabled).",
					});
				}
			}
		} else {
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) {
				toast.error("Authentication Error", { description: error.message });
			} else {
				toast.success("Success!", { description: "Logged in successfully." });
				router.push("/dashboard");
			}
		}
		setLoading(false);
	};

	return (
		<Card className='w-[350px]'>
			<CardHeader>
				<CardTitle>{mode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
				<CardDescription>
					{mode === "signin"
						? "Enter your credentials to access your account."
						: "Create your account to get started."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleAuth}>
					<div className='grid w-full items-center gap-4'>
						{mode === "signup" && (
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='username'>Username</Label>
								<Input
									id='username'
									type='text'
									placeholder='Enter your username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
							</div>
						)}
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='you@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='********'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{mode === "signup" && (
							<div className='flex flex-col space-y-2'>
								<Label>Account Type</Label>
								<div className='flex space-x-4'>
									<div className='flex items-center space-x-2'>
										<input
											id='seller'
											type='radio'
											name='userType'
											value='Seller'
											checked={userType === 'Seller'}
											onChange={(e) => setUserType(e.target.value as 'Seller' | 'Buyer')}
											required
										/>
										<Label htmlFor='seller'>Seller</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											id='buyer'
											type='radio'
											name='userType'
											value='Buyer'
											checked={userType === 'Buyer'}
											onChange={(e) => setUserType(e.target.value as 'Seller' | 'Buyer')}
											required
										/>
										<Label htmlFor='buyer'>Buyer</Label>
									</div>
								</div>
							</div>
						)}
						<Button
							type='submit'
							className='w-full'
							disabled={loading}>
							{loading
								? "Loading..."
								: mode === "signin"
								? "Sign In"
								: "Sign Up"}
						</Button>
					</div>
				</form>
			</CardContent>
			<CardFooter className='flex justify-center'>
				<Button
					variant='link'
					onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
					{mode === "signin"
						? "Need an account? Sign Up"
						: "Already have an account? Sign In"}
				</Button>
			</CardFooter>
		</Card>
	);
}
