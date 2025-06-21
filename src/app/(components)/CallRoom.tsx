"use client";
import { useRouter } from "next/navigation";
import {
	SpeakerLayout,
	CallControls,
	Call,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect } from "react";
import { showToast } from "@/lib/utils";

export default function CallRoom({ call }: { call: Call }) {
	const { useIsCallRecordingInProgress } = useCallStateHooks();
	const isCallRecordingInProgress = useIsCallRecordingInProgress();
	const router = useRouter();

	const handleLeave = () => {
		if (confirm("Are you sure you want to leave the call?")) {
			router.push("/dashboard");
		}
	};

	useEffect(() => {
		if (!call) return;

		const eventHandlers = [
			call.on("call.recording_started", () => {
				return showToast("success", "Recording started");
			}),
			call.on("call.recording_stopped", () => {
				return showToast("error", "Recording stopped");
			}),
		];
		return () => {
			eventHandlers.forEach((unsubscribe) => unsubscribe());
		};
	}, [call]);

	return (
		<section className='min-h-screen w-full'>
			<div className='flex h-[80vh] items-center'>
				<SpeakerLayout participantsBarPosition='right' />
			</div>
			<div className='bg-gray-100 flex w-full items-center justify-center gap-5'>
				<CallControls onLeave={handleLeave} />
				{isCallRecordingInProgress && (
					<p className='text-green-500 text-sm'>Recording in progress...</p>
				)}
				<EndCallButton call={call} />
			</div>
		</section>
	);
}

const EndCallButton = ({ call }: { call: Call }) => {
	const { useLocalParticipant } = useCallStateHooks();
	const localParticipant = useLocalParticipant();
	const router = useRouter();

	const participantIsHost =
		localParticipant &&
		call.state.createdBy &&
		localParticipant.userId === call.state.createdBy.id;

	if (!participantIsHost) return null;

	const handleEndCall = () => {
		call.endCall();
		showToast("success", "Call ended successfully");
		router.push("/dashboard");
	};

	return (
		<button
			className='bg-red-400 text-white px-3 py-2 rounded-md mt-2 hover:bg-red-600'
			onClick={handleEndCall}
		>
			End call
		</button>
	);
};