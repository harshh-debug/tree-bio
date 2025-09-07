"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getAvailableUsernameSuggestions } from "../utils";
import { error } from "console";
import { ProfileFormData } from "@/modules/links/components/LinkForm";

export const checkProfileUsernameAvailabilty = async (username: string) => {
	if (!username) return { available: false, suggestions: [] };
	const user = await db.user.findUnique({
		where: {
			username: username,
		},
	});
	if (!user) {
		return { available: true };
	}
	const suggestions = await getAvailableUsernameSuggestions(username, 3, 10);

	return {
		available: false,
		suggestions,
	};
};

export const claimUsername = async (username: string) => {
	const loggedInUser = await currentUser();
	if (!loggedInUser)
		return {
			success: false,
			error: "No authenticated user found",
		};
	const user = await db.user.update({
		where: {
			clerId: loggedInUser.id,
		},
		data: {
			username: username,
		},
	});
	if (!user) return { success: false, error: "No authenticated user found" };
	return { success: true };
};

export const getCurrentUsername = async () => {
	const user = await currentUser();
	const currentUsername = await db.user.findUnique({
		where: {
			clerId: user?.id,
		},
		select: {
			firstName: true,
			lastName: true,
			username: true,
			bio: true,
			socialLinks: true,
		},
	});
	return currentUsername;
};

export const createUserProfile = async (data: ProfileFormData) => {
	const user = await currentUser();

	if (!user) return { success: false, error: "No authenticated user found" };

	const profile = await db.user.update({
		where: {
			clerId: user.id,
		},
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			bio: data.bio,
			imgUrl: data.imageUrl,
			username: data.username,
		},
	});

	return {
		sucess: true,
		message: "Profile created successfully",
		data: profile,
	};
};

export const getUserByUsername = async (username: string) => {
	const currentUsername = await db.user.findUnique({
		where: {
			username: username,
		},
		include: {
			links: true,
			socialLinks: true,
		},
	});
	return currentUsername;
};
