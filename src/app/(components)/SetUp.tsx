"use client";
import { showToast } from "@/lib/utils";
import { Call, VideoPreview } from "@stream-io/video-react-sdk";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { useState } from "react";


export default function SetUp({
	call,
	setIsCallJoined,
}: {
	call: Call;
	setIsCallJoined: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [camEnabled, setCamEnabled] = useState<boolean>(false);
	const [micEnabled, setMicEnabled] = useState<boolean>(false);

	const handleEnableCamera = () => {
		if (!camEnabled) {
			call?.camera.enable();
			setCamEnabled(true);
			showToast("success", "Camera enabled");
		} else {
			call?.camera.disable();
			setCamEnabled(false);
			showToast("error", "Camera disabled");
		}
	};

	const handleEnableMic = () => {
		if (!micEnabled) {
			call?.microphone.enable();
			setMicEnabled(true);
			showToast("success", "Microphone enabled");
		} else {
			call?.microphone.disable();
			setMicEnabled(false);
			showToast("error", "Microphone disabled");
		}
	};

	const handleJoinCall = () => {
		call.join();
		setIsCallJoined(true);
	};

	return (
		<main className=' w-full flex flex-col items-center justify-center'>
			<h2 className='text-xl font-bold text-center text-blue-500'>
				{call.state.custom.title}
			</h2>
			<p className='text-center mb-4 text-gray-400 text-sm'>
				{call.state.custom.description}
			</p>

			<h2 className='text-lg font-bold text-center mb-4'>Please update your microphone and camera settings</h2>

			<div className='w-2/5 h-[400px] rounded-lg shadow-md'>
				<VideoPreview className='w-full h-full mt-4' />
			</div>

			<div className='flex gap-4 my-4'>
				<div
					className='shadow-md rounded-full p-4 bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer'
					onClick={handleEnableCamera}
				>
					{camEnabled ? (
						<CameraOff className='text-blue-500' size={30} />
					) : (
						<Camera className='text-blue-500' size={30} />
					)}
				</div>

				<div
					className='shadow-md rounded-full p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer'
					onClick={handleEnableMic}
				>
					{micEnabled ? (
						<MicOff className='text-blue-500' size={40} />
					) : (
						<Mic className='text-blue-500' size={40} />
					)}
				</div>

				
			</div>

			<button
				className='bg-blue-500 mt-2 text-white rounded-lg  px-8 py-3 shadow-md hover:bg-blue-600 transition-all duration-200'
				onClick={handleJoinCall}
			>
				Join Call
			</button>
		</main>
	);
}