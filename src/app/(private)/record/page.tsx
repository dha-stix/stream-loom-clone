"use client";
import CallRoom from "@/app/(components)/CallRoom";
import Nav from "@/app/(components)/Nav";
import SetUp from "@/app/(components)/SetUp";
import AuthContext from "@/app/(components)/AuthContext";
import { generateSlug } from "@/lib/utils";
import {
	Call,
	StreamCall,
	StreamTheme,
	useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";

export default function Record() {
	const [createCall, setCreateCall] = useState<boolean>(false);
	const [call, setCall] = useState<Call | null>(null);

	return (
		<main>
			<Nav />
			{createCall ? (
				<Screen call={call} />
			) : (
				<CreateForm setCreateCall={setCreateCall} setCall={setCall} />
			)}
		</main>
	);
}

const CreateForm = ({
	setCreateCall,
	setCall,
}: {
	setCreateCall: Dispatch<SetStateAction<boolean>>;
	setCall: Dispatch<SetStateAction<Call | null>>;
}) => {
	const [processing, setProcessing] = useState<boolean>(false);
	const { user } = useContext(AuthContext);
	const client = useStreamVideoClient();

	const handleCreateCall = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!client || !user)
			return console.error("Stream Video client is not initialized");
		setProcessing(true);
		const formData = new FormData(e.currentTarget);
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;

		try {
			const call = client.call("default", generateSlug(title));
			if (!call) throw new Error("Failed to create meeting");

			await call.getOrCreate({
				data: {
					starts_at: new Date().toISOString(),
					custom: {
						title,
						description,
					},
					members: [{ user_id: user.uid }],
				},
			});

			setProcessing(false);
			setCall(call);
			setCreateCall(true);
		
		} catch (error) {
			console.error("Error creating call:", error);
			setProcessing(false);
		}
	};
	
	return (
		<main className='w-full min-h-[90vh] md:px-8 px-2 py-4 flex items-center justify-center'>
			<form
				className='w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md'
				onSubmit={handleCreateCall}
			>
				<h2 className='text-2xl font-bold mb-4'>Create Call Session</h2>
				<div className='mb-4'>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-gray-700 mb-2'
					>
						Title
					</label>
					<input
						type='text'
						name='title'
						id='title'
						required
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						placeholder='Enter recording title'
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='description'
						className='block text-sm font-medium text-gray-700 mb-2'
					>
						Description
					</label>
					<textarea
						name='description'
						id='description'
						rows={3}
						required
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						placeholder='Enter recording description'
					/>
				</div>

				<button
					type='submit'
					disabled={processing}
					className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md w-full transition-colors'
				>
					{processing ? "Creating..." : "Create Session"}
				</button>
			</form>
		</main>
	);
};

const Screen = ({ call }: { call: Call | null }) => {
	const [isCallJoined, setIsCallJoined] = useState(false);

	if (!call) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<Loader2 className='animate-spin h-8 w-8 text-blue-500' />
				<p className='text-gray-500'>No active call found.</p>
			</div>
		);
	}

	return (
		<main className='w-full'>
				<StreamCall call={call}>
					<StreamTheme>
						{isCallJoined ? (
							<CallRoom call={call} />
						) : (
							<SetUp call={call} setIsCallJoined={setIsCallJoined} />
						)}
					</StreamTheme>
				</StreamCall>
		</main>
	);
};