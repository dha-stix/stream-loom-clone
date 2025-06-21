import { useEffect, useState } from "react";
import {  useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetRecordings = (userId: string) => {
	const [callWithRecordings, setCallWithRecordings] = useState<CallWithRecordings[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const client = useStreamVideoClient();

	useEffect(() => {
		if (!client) return;

		const loadCallRecordings = async () => {
			try {
				const { calls } = await client.queryCalls({
					sort: [{ field: "starts_at", direction: 1 }],
					filter_conditions: {
						$or: [
							{ created_by_user_id: userId },
							{ members: { $in: [userId] } },
						],
					},
				});

				if (!calls || calls.length === 0) {
					setCallWithRecordings([]);
					setIsLoading(false);
					return;
				}

				const enrichedCallsRaw = await Promise.all(
					calls.map(async (call) => {
						try {
							const { recordings } = await call.queryRecordings();

							if (recordings && recordings.length > 0) {
								return { recordings, call } 
							} else {
								console.log(`No recordings found for call: ${call.id}`);
								return null;
							}
						} catch (error) {
							console.error(
								"Error fetching recordings for call:",
								call.id,
								error
							);
							return null;
						}
					})
				);

				const enrichedCalls: CallWithRecordings[] = enrichedCallsRaw.filter(
					(item): item is CallWithRecordings => item !== null
				);

				setCallWithRecordings(enrichedCalls);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching calls:", error);
				setIsLoading(false);
			}
		};

		loadCallRecordings();
	}, [client, userId]);

	return { callWithRecordings, isLoading };
};