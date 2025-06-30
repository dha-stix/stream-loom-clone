"use server";
import { StreamClient } from "@stream-io/node-sdk";
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY!;

// 👇🏻 -- For Stream Video  --
export const tokenProvider = async (user_id: string) => {
	if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
	if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

	const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

	const token = streamClient.generateUserToken({
		user_id,
		validity_in_seconds: 3600,
	});

	return token;
};
