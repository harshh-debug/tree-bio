import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen dark:bg-neutral-800 text-neutral-900 dark: text-neutral-100">
			<h1 className="text-2xl font-bold mb-6">Welcome! to TreeBio🌳</h1>
			<p className="text-lg mb-4 font-semibold text-gray-500">Please sign up to continue. If already have an account, you can sign in.</p>

			<div className="mt-6">
				<SignUp />
			</div>

		</div>
	)
}
