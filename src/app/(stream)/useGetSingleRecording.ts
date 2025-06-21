import { useEffect, useState } from "react";
import {  CallRecording, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

export const useGetSingleRecording = (callId: string, recordId: string) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const client = useStreamVideoClient();
    const router = useRouter();
    const [recording, setRecording] = useState<CallRecording | null>(null);

    useEffect(() => { 
        if(!client || !callId || !recordId) {
            setIsLoading(false);
            return;
        }

        const loadRecording = async () => { 
            try {
                const { calls } = await client.queryCalls(
                    {
                        filter_conditions: { id: callId }
                    })
                
                if (!calls || calls.length === 0) {
                    console.error(`No call found with ID: ${callId}`);
                    setIsLoading(false);
                    return;
                }

                const { recordings } = await calls[0].queryRecordings()
                const foundRecording = recordings.find((rec) => rec.session_id === recordId);

                if (!foundRecording) {
                    setIsLoading(false);
                    return router.push('/dashboard');
                }
                setRecording(foundRecording);

            } catch (error) {
                console.error("Error fetching recording:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadRecording();

    }, [callId, recordId, client, router]);


    return { isLoading, recording}
}
