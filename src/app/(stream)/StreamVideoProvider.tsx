"use client";
import { useState, ReactNode, useEffect, useContext, useCallback } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { tokenProvider } from "../../../actions/stream.action";
import AuthContext from "../(components)/AuthContext";
import { Loader2 } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
	const { user, loading } = useContext(AuthContext);
	const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
		null
	);

	const getClient = useCallback(async () => {
		if (!user) return null;

		const client = new StreamVideoClient({
			apiKey,
			user: {
				id: user.uid,
				name: user.displayName ?? "",
				image: `${
					process.env.NEXT_PUBLIC_IMAGE_URL
				}${user.displayName?.toLowerCase()}`,
			},
			tokenProvider: () => tokenProvider(user.uid),
		});
		setVideoClient(client);
	}, [user]);

	useEffect(() => {
		getClient();
	}, [getClient]);

	if (!videoClient || loading || !user) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<Loader2 size='32' className='mx-auto animate-spin' />
			</div>
		);
	}

	return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};