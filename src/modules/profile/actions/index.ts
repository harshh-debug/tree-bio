"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getAvailableUsernameSuggestions } from "../utils";
import { error } from "console";
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
    return{success:true}
};
