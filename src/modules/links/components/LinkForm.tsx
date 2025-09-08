"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	Plus,
	Instagram,
	Youtube,
	Mail,
	Archive,
	FolderPlus,
	Camera,
	Edit3,
	X,
	Edit,
	Github,
	Linkedin,
	Twitter,
} from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { LinkCard, LinkFormWithPreview } from "./LinkCard";
import {
	addSocialLink,
	createLinkByUser,
	deleteLink,
	deleteSocialLink,
	editLink,
	editSocialLink,
} from "../actions";
import { createUserProfile } from "@/modules/profile/actions";
import { SocialLinkModal } from "./SocialLinkModal";

const profileSchema = z.object({
	firstName: z
		.string()
		.min(1, "First name is required")
		.max(50, "First name must be less than 50 characters"),
	lastName: z
		.string()
		.max(50, "Last name must be less than 50 characters")
		.optional(),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username must be less than 30 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers, and underscores"
		),
	bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
	imageUrl: z.string().url("Please enter a valid image URL").optional(),
});

const linkSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be less than 100 characters"),
	url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
	description: z
		.string()
		.max(200, "Description must be less than 200 characters")
		.optional(),
});

const socialLinkSchema = z.object({
	platform: z.enum(["instagram", "youtube", "email", "github", "linkedin", "twitter"]),
	url: z.url("Please enter a valid URL"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type LinkFormData = z.infer<typeof linkSchema>;
export type socialLinksData = z.infer<typeof socialLinkSchema>;

interface Profile {
	firstName: string;
	lastName: string;
	username: string;
	bio?: string;
	imageUrl?: string;
}

interface SocialLink {
	id: string;
	platform: string;
	url: string;
}

interface Props {
	username: string;
	bio: string;
	link: {
		id: string;
		title: string;
		description: string;
		url: string;
		clickCount: number;
		createdAt: Date;
	}[];
	socialLinks?: SocialLink[];
}

interface Link {
	id: string;
	title: string;
	url: string;
	description?: string;
	clickCount: number;
}

const LinkForm = ({
	username,
	bio,
	link,
	socialLinks: initialSocialLink = [],
}: Props) => {
	const currentUser = useUser();
	const [profile, setProfile] = useState<Profile>({
		firstName: currentUser.user?.firstName || "",
		lastName: currentUser.user?.lastName || "",
		username: username || "",
		bio: bio || "",
		imageUrl:
			currentUser.user?.imageUrl ||
			`https://avatar.iran.liara.run/username?username=[${currentUser.user?.firstName}+${currentUser.user?.lastName}]`,
	});

	const [editingProfile, setEditingProfile] = useState(false);
	const [isAddingLink, setIsAddingLink] = React.useState(false);
	const [links, setLinks] = React.useState<Link[]>(link || []);
	const [editingLinkId, setEditingLinkId] = React.useState<string | null>(null);

	//social links
	const [userSocialLinks, setUserSocialLinks] =
		useState<SocialLink[]>(initialSocialLink);
	const [isSocialModalOpen, setIsSocialModalOpen] = React.useState(false);
	const [editingSocialLink, setEditingSocialLink] =
		React.useState<SocialLink | null>(null);

	const getSocialIcon = (platform: string) => {
		switch (platform) {
			case "instagram":
				return Instagram;
			case "youtube":
				return Youtube;
			case "email":
				return Mail;
			case "github":
				return Github;
			case "linkedin":
				return Linkedin;
			case "twitter":
				return Twitter;
			default:
				return Mail;
		}
	};

	// Get social platform colors for better visual distinction
	const getSocialColor = (platform: string) => {
		switch (platform) {
			case "instagram":
				return "hover:bg-pink-500 hover:text-white";
			case "youtube":
				return "hover:bg-red-500 hover:text-white";
			case "email":
				return "hover:bg-blue-500 hover:text-white";
			case "github":
				return "hover:bg-gray-900 hover:text-white";
			case "linkedin":
				return "hover:bg-blue-600 hover:text-white";
			case "twitter":
				return "hover:bg-black hover:text-white";
			default:
				return "hover:bg-gray-500 hover:text-white";
		}
	};

	// Profile form
	const profileForm = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: profile.firstName || "",
			lastName: profile.lastName || "",
			username: profile.username,
			bio: profile.bio || "",
		},
	});

	// Link form
	const linkForm = useForm<LinkFormData>({
		resolver: zodResolver(linkSchema),
		defaultValues: {
			title: "",
			url: "",
			description: "",
		},
	});

	const onProfileSubmit = async (data: ProfileFormData) => {
		try {
			setProfile((prev) => ({ ...prev, ...data }));
			const updatedProfile = await createUserProfile(data);
			console.log("Updated Profile:", updatedProfile);
			toast.success("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile: ", error);
			toast.error("Failed to update profile.");
		} finally {
			profileForm.reset();
			setEditingProfile(false);
		}
	};
	const onLinkSubmit = async (data: LinkFormData) => {
		try {
			const link = await createLinkByUser(data);
			if (link?.data?.id) {
				setLinks((prev) => [
					...prev,
					{ id: link.data.id, ...data, clickCount: 0 },
				]);
			}
			toast.success("Link created successfully!");
		} catch (error) {
			console.error("something went wrong", error);
			toast.error("Failed to create link.");
		} finally {
			linkForm.reset();
			setIsAddingLink(false);
		}
	};
	const onEditLinkSubmit = async (data: LinkFormData) => {
		if (!editingLinkId) return;
		try {
			const res = await editLink(data, editingLinkId);
			if (res?.sucess) {
				setLinks((prev) =>
					prev.map((l) => (l.id === editingLinkId ? { ...l, ...data } : l))
				);
				toast.success("Link edited successfully!");
			} else {
				toast.error(res?.error || "Failed to edit link.");
			}
		} catch (error) {
			console.error("Error editing link:", error);
			toast.error("Failed to edit link.");
		} finally {
			setIsAddingLink(false);
			setEditingLinkId(null);
		}
	};
	const onSocialLinkSubmit = async (data: socialLinksData) => {
		try {
			if (editingSocialLink) {
				// Edit existing social link
				const result = await editSocialLink(data, editingSocialLink.id);
				if (result?.sucess) {
					setUserSocialLinks((prev) =>
						prev.map((link) =>
							link.id === editingSocialLink.id
								? { ...link, platform: data.platform, url: data.url }
								: link
						)
					);
					toast.success(`${data.platform} link updated successfully!`);
				} else {
					toast.error(result?.error || "Failed to update social link.");
				}
			} else {
				// Add new social link
				const result = await addSocialLink(data);
				if (result?.sucess && result?.data) {
					const newSocialLink: SocialLink = {
						id: result.data.id,
						platform: data.platform,
						url: data.url,
					};
					setUserSocialLinks((prev) => [...prev, newSocialLink]);
					toast.success(`${data.platform} link added successfully!`);
				} else {
					toast.error(result?.error || "Failed to add social link.");
				}
			}
		} catch (error) {
			console.error("Error saving social link:", error);
			toast.error("Failed to save social link.");
		} finally {
			setEditingSocialLink(null);
		}
	};
	const handleAddSocialLink = () => {
		setEditingSocialLink(null);
		setIsSocialModalOpen(true);
	};
	const handleDeleteLink = async (linkId: string) => {
		try {
			// Delete the link
			const deletedLink = await deleteLink(linkId);
			console.log("Deleted Link:", deletedLink);
			setLinks((prev) => prev.filter((link) => link.id !== linkId));
			toast.success("Link deleted successfully!");
		} catch (error) {
			console.error("Error deleting link:", error);
			toast.error("Failed to delete link.");
		}
	};
	const handleEditSocialLink = (socialLink: SocialLink) => {
		setEditingSocialLink(socialLink);
		setIsSocialModalOpen(true);
	};
	const handleDeleteSocialLink = async (socialLinkId: string) => {
		try {
			const result = await deleteSocialLink(socialLinkId);
			if (result?.sucess) {
				setUserSocialLinks((prev) =>
					prev.filter((link) => link.id !== socialLinkId)
				);
				toast.success("Social link removed successfully!");
			} else {
				toast.error(result?.error || "Failed to delete social link.");
			}
		} catch (error) {
			console.error("Error deleting social link:", error);
			toast.error("Failed to delete social link.");
		}
	};

	// Edit link handler
	const handleEditLink = (linkId: string) => {
		setEditingLinkId(linkId);
		setIsAddingLink(true);
	};

	return (
		<div className="w-full max-w-2xl mx-auto space-y-6">
			{/* Profile Section */}
			<Card className="border-2 border-dashed border-gray-200 hover:border-green-400 transition-colors">
				<CardContent className="p-6">
					<div className="flex items-center gap-4">
						<div className="relative group">
							<Avatar className="h-20 w-20 border-4 border-white shadow-lg">
								<AvatarImage
									src={profile.imageUrl || "/placeholder.svg"}
									alt={profile.username}
								/>
								<AvatarFallback className="text-lg font-semibold bg-gray-100 text-gray-600">
									{profile.username.slice(0, 2).toUpperCase() || "UN"}
								</AvatarFallback>
							</Avatar>
							<Button
								size="sm"
								variant="secondary"
								className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<Camera size={14} />
							</Button>
						</div>

						<div className="flex-1 space-y-2">
							{editingProfile ? (
								<form
									onSubmit={profileForm.handleSubmit(onProfileSubmit)}
									className="space-y-2"
								>
									<div className="flex gap-2">
										<Input
											{...profileForm.register("firstName")}
											placeholder="First Name"
										/>
										<Input
											{...profileForm.register("lastName")}
											placeholder="Last Name"
										/>
									</div>
									<div>
										<Input
											{...profileForm.register("username")}
											placeholder="Username"
											className="font-semibold cursor-not-allowed"
											readOnly
											disabled
										/>
										{profileForm.formState.errors.username && (
											<p className="text-sm text-red-500 mt-1">
												{profileForm.formState.errors.username.message}
											</p>
										)}
									</div>
									<div>
										<Textarea
											{...profileForm.register("bio")}
											placeholder="Add bio..."
											className="resize-none"
											rows={2}
										/>
										{profileForm.formState.errors.bio && (
											<p className="text-sm text-red-500 mt-1">
												{profileForm.formState.errors.bio.message}
											</p>
										)}
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											type="submit"
											disabled={profileForm.formState.isSubmitting}
										>
											Save
										</Button>
										<Button
											size="sm"
											variant="outline"
											type="button"
											onClick={() => setEditingProfile(false)}
										>
											Cancel
										</Button>
									</div>
								</form>
							) : (
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-lg">
											{profile.username || "Add username..."}
										</h3>
										<Button
											size="sm"
											variant="ghost"
											className="h-6 w-6 p-0"
											onClick={() => setEditingProfile(true)}
										>
											<Edit3 size={12} />
										</Button>
									</div>
									<p className="text-sm text-muted-foreground">
										{profile.bio || "Add bio..."}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Social Links */}
					<div className="mt-4 flex gap-2 flex-wrap">
						{/* Display existing social links */}
						{userSocialLinks.map((socialLink) => {
							const Icon = getSocialIcon(socialLink.platform);
							const colorClass = getSocialColor(socialLink.platform);
							return (
								<div key={socialLink.id} className="relative group">
									<Button
										variant="outline"
										size="sm"
										className={`h-9 w-9 p-0 bg-transparent transition-colors ${colorClass}`}
										onClick={() => window.open(socialLink.url, "_blank")}
									>
										<Icon size={16} />
									</Button>
									
									{/* Edit and Delete buttons on hover */}
									<div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											size="sm"
											variant="secondary"
											className="h-5 w-5 rounded-full p-0 text-white"
											onClick={(e) => {
												e.stopPropagation();
												handleEditSocialLink(socialLink);
											}}
											title="Edit social link"
										>
											<Edit size={8} />
										</Button>
										<Button
											size="sm"
											variant="secondary"
											className="h-5 w-5 rounded-full p-0"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteSocialLink(socialLink.id);
											}}
											title="Delete social link"
										>
											<X size={8} />
										</Button>
									</div>
								</div>
							);
						})}

						{/* Add new social link button */}
						<Button
							variant="outline"
							size="sm"
							className="h-9 w-9 p-0 border-dashed bg-transparent hover:border-solid"
							onClick={handleAddSocialLink}
							title="Add social link"
						>
							<Plus size={16} />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Links Section */}
			<div className="space-y-3">
				{links.map((link, index) => (
					<LinkCard
						key={link.id}
						link={link}
						onDelete={handleDeleteLink}
						onEdit={handleEditLink}
					/>
				))}

				{/* Add New Link */}
				{isAddingLink ? (
					<LinkFormWithPreview
						onCancel={() => {
							setIsAddingLink(false);
							setEditingLinkId(null);
						}}
						onSubmit={editingLinkId ? onEditLinkSubmit : onLinkSubmit}
						defaultValues={
							editingLinkId
								? links.find((l) => l.id === editingLinkId) || {
										title: "",
										url: "",
										description: "",
								  }
								: { title: "", url: "", description: "" }
						}
					/>
				) : (
					<Button
						onClick={() => setIsAddingLink(true)}
						className="w-full h-12 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 dark:text-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
						variant="outline"
					>
						<Plus size={20} className="mr-2" />
						Add Link
					</Button>
				)}
			</div>

			{/* Bottom Actions */}
			<div className="flex items-center justify-between pt-4 border-t">
				<Button
					variant="outline"
					onClick={() => toast.success("Feature coming soon!")}
					className="flex items-center gap-2 bg-transparent cursor-pointer"
				>
					<FolderPlus size={16} />
					Add Collection
				</Button>

				<Button
					variant="outline"
					className="flex items-center gap-2 bg-transparent cursor-pointer"
					onClick={() => toast.success("Feature coming soon!")}
				>
					<Archive size={16} />
					View Archive
				</Button>
			</div>

			{/* Social Link Modal */}
			<SocialLinkModal
				isOpen={isSocialModalOpen}
				onClose={() => setIsSocialModalOpen(false)}
				onSubmit={onSocialLinkSubmit}
				defaultValues={
					editingSocialLink
						? {
								platform: editingSocialLink.platform as
									| "instagram"
									| "youtube"
									| "email"
									| "github"
									| "linkedin"
									| "twitter",
								url: editingSocialLink.url,
						  }
						: undefined
				}
			/>
		</div>
	);
};

export default LinkForm;