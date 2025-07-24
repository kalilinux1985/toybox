import FullScreenMessage from "@/components/full-screen-message";
import { AuthForm } from "./auth-form";

interface HomePageContentProps {
	user: any; // Replace 'any' with your user type
	isLoading: boolean;
}

const HomePageContent = ({ user, isLoading }: HomePageContentProps) => {
	if (isLoading) {
		return <FullScreenMessage message='Checking authentication status...' />;
	}

	if (user) {
		return <FullScreenMessage message='Redirecting to dashboard...' />;
	}

	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-24'>
			<AuthForm />
		</main>
	);
};

export default HomePageContent;
