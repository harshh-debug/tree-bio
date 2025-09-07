import { Button } from "@/components/ui/button";
import { onBoardUser } from "@/modules/auth/actions";
import ClaimLinkForm from "@/modules/home/components/ClaimLinkForm";
import { getCurrentUsername } from "@/modules/profile/actions";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const HomePage = async () => {
	const clerkUser = await currentUser();
	const user = clerkUser ? await onBoardUser() : null;
	const profile = clerkUser ? await getCurrentUsername() : null;
	
	return (
		<div className="min-h-screen">
			<main className="text-center space-y-8 py-32">
				<div className="space-y-6">
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-zinc-700 dark:text-zinc-100">
						Everything you are.
						<br />
						<span className="text-[#41B313]">In one simple link.</span>
					</h1>

					<p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
						One link that does more. With TreeBio, you can manage all your links, track clicks and views in real time, and grow your online presence without the hassle.
					</p>
					
					<div className="pt-4">
						{/* Show dashboard button only for signed-in users with username */}
						{clerkUser && user?.success && profile?.username && (
							<Link href="/admin/my-tree">
								<Button
									size="lg"
									className="px-8 py-3 text-lg font-medium cursor-pointer bg-[#41B313] hover:bg-[#369611] text-white"
								>
									Go to TreeBio Dashboard
								</Button>
							</Link>
						)}

						{/* Show join button only for non-signed-in users */}
						{!clerkUser && (
							<div className="space-y-4">
								<SignInButton>
									<Button
										size="lg"
										className="px-8 py-3 text-lg font-medium cursor-pointer bg-[#399e12] hover:bg-[#369611] text-white transform hover:scale-105 transition-all duration-300 shadow-lg"
									>
										🚀 Start Your TreeBio Journey
									</Button>
								</SignInButton>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Create your personalized link in under 60 seconds
								</p>
							</div>
						)}

						{/* Show claim form only for signed-in users without username */}
						{clerkUser && user?.success && !profile?.username && (
							<p className="text-base text-gray-500 dark:text-gray-400">
								Complete your profile setup below to get started!
							</p>
						)}
					</div>
				</div>

				{/* Show claim link form section only for signed-in users */}
				{clerkUser && (
					<section className="pb-16 md:pb-24">
						<div className="max-w-md mx-auto">
							<ClaimLinkForm />
						</div>
					</section>
				)}

				{/* Show features/benefits section for non-signed-in users */}
				{!clerkUser && (
					<section className="pb-16 md:pb-24">
						<div className="max-w-5xl mx-auto px-4">
							<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
								<div className="text-center space-y-4">
									<div className="w-16 h-16 bg-[#41B313]/10 rounded-full flex items-center justify-center mx-auto">
										<span className="text-2xl">🔗</span>
									</div>
									<h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-100">
										One Simple Link
									</h3>
									<p className="text-gray-500 dark:text-gray-400">
										Connect all your socials, websites, and custom links in one beautiful TreeBio link
									</p>
								</div>
								<div className="text-center space-y-4">
									<div className="w-16 h-16 bg-[#41B313]/10 rounded-full flex items-center justify-center mx-auto">
										<span className="text-2xl">👁️</span>
									</div>
									<h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-100">
										Live Preview
									</h3>
									<p className="text-gray-500 dark:text-gray-400">
										Public profile page with real-time preview while editing in your dashboard
									</p>
								</div>
								<div className="text-center space-y-4">
									<div className="w-16 h-16 bg-[#41B313]/10 rounded-full flex items-center justify-center mx-auto">
										<span className="text-2xl">📊</span>
									</div>
									<h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-100">
										Real-time Analytics
									</h3>
									<p className="text-gray-500 dark:text-gray-400">
										Track profile views, link clicks, top performers, and recent visitors
									</p>
								</div>
								<div className="text-center space-y-4">
									<div className="w-16 h-16 bg-[#41B313]/10 rounded-full flex items-center justify-center mx-auto">
										<span className="text-2xl">📱</span>
									</div>
									<h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-100">
										QR Code Generator
									</h3>
									<p className="text-gray-500 dark:text-gray-400">
										Generate and download QR codes to easily share your TreeBio link anywhere
									</p>
								</div>
							</div>
						</div>
					</section>
				)}
			</main>
		</div>
	);
};

export default HomePage;