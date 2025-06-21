"use client";
import CommentBox from "@/app/(components)/CommentBox";
import Nav from "@/app/(components)/Nav";
import AuthContext from "@/app/(components)/AuthContext";
import CopyToClipboard from "react-copy-to-clipboard";
import { useGetSingleRecording } from "@/app/(stream)/useGetSingleRecording";
import db from "@/lib/firebase";
import {
	addComment,
	addReaction,
	getComments,
	getReactions,
} from "@/lib/serverfunction";
import { doc, onSnapshot } from "firebase/firestore";
import { ClipboardList, Loader2, MessageCircleHeart, Send } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState, useCallback } from "react";
import { showToast } from "@/lib/utils";
import Link from "next/link";

export default function Recording() {
	const { id } = useParams<{ id: string }>();
	const searchParams = useSearchParams();
	const recordID = searchParams.get("search");
	const { isLoading, recording } = useGetSingleRecording(
		id,
		recordID as string
	);
	const [comments, setComments] = useState<CommentArgs[]>([]);
	const [reactions, setReactions] = useState<string[]>([]);
	const { user } = useContext(AuthContext);
	const URL = `${process.env.NEXT_PUBLIC_HOST_URL}record/${id}?search=${recordID}`;
	const [URLCopied, setURLCopied] = useState<boolean>(false);
	const handleCopy = () => {
		setURLCopied(true);
		showToast("success", "URL copied to clipboard");
	}

	const fetchComments = useCallback(async () => {
		if (!recordID) return;
		const { comments } = await getComments(recordID);
		const { reactions } = await getReactions(recordID);
		setComments(comments);
		setReactions(reactions as string[]);
	}, [recordID]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	useEffect(() => {
		if (!recordID) return;
		const unsubscribe = onSnapshot(doc(db, "comments", recordID), (docSnap) => {
			if (docSnap.exists()) {
				setComments(docSnap.data().comments || []);
			}
		});

		return () => unsubscribe();
	}, [recordID]);

	if (isLoading) {
		return (
			<div className='w-full h-[75vh] flex items-center justify-center'>
				<Loader2 className='animate-spin text-blue-500' size={40} />
			</div>
		);
	}

	if (!recording && !isLoading) {
		return (
			<div className='w-full h-[75vh] flex items-center justify-center'>
				<p className='text-red-500'>No recording found</p>
			</div>
		);
	}

	const handleReactions = async () => {
		if (!user || !recordID) return;
		const { reactions, message, success } = await addReaction(
			user.uid,
			recordID
		);
		if (success) {
			setReactions(reactions as string[]);
			showToast("success", message);
		} else {
			showToast("error", message);
		}
	};

	return (
		<div>
			<Nav />
			<main className='w-full md:px-8 px-2 py-4'>
				<div className=' w-full h-[75vh] rounded-md bg-gray-200 flex items-center justify-center'>
					<video
						controls
						width='100%'
						style={{ borderRadius: "12px", height: "100%" }}
					>
						<source src={recording?.url} type='video/mp4' />
						Your browser does not support the video tag.
					</video>
				</div>

				{!user ? (
					<Link
						href='/login'
						className='text-blue-500 text-sm mt-4 inline-block'
					>
						Please login to add comments or reactions
					</Link>
				) : (
						
						<section className='mt-4'>
					<div className='flex items-center justify-between mb-4'>
						<section>
							<h2 className='text-2xl text-blue-500 font-bold'>Comments</h2>
							<p className='opacity-60 text-xs mb-4'>
								Add comments for the video creator
							</p>
						</section>

						<section className='flex items-center gap-4'>
							<button
								className='bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center text-center text-sm'
								onClick={handleReactions}
							>
								{reactions.length}
								<MessageCircleHeart className='ml-2' size={20} />
							</button>

							<CopyToClipboard text={URL} onCopy={handleCopy}>
									<button className='bg-green-500 p-3 rounded-md hover:bg-green-600 transition-colors text-center text-sm text-white'>
										{URLCopied ? <ClipboardList size={20} /> : <Send size={20} />}
								</button>
								</CopyToClipboard>
						
							
				
							
							
						</section>
					</div>

					<CommentForm />

					<CommentBox comments={comments} />
				</section>
						
				)}
				
			</main>
		</div>
	);
}

const CommentForm = () => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [comment, setComment] = useState<string>("");
	const searchParams = useSearchParams();
	const recordID = searchParams.get("search");
	const { user } = useContext(AuthContext);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		if (!user) return;
		e.preventDefault();
		setIsSubmitting(true);
		const { success, message } = await addComment({
			comment,
			userName: user.displayName!,
			recordID: recordID as string,
		});
		if (success) {
			showToast("success", message);
			setIsSubmitting(false);
			setComment("");
		} else {
			showToast("error", message);
		}
	};

	return (
		<form className='w-full mb-6' onSubmit={handleSubmit}>
			<textarea
				rows={6}
				required
				id='comment'
				name='comment'
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder='Add a comment...'
				className='w-full p-3 text-sm border-[1px] border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
			/>

			<button
				type='submit'
				disabled={isSubmitting}
				className='bg-blue-500 text-white px-6 py-2 rounded-md mt-2 hover:bg-blue-600 transition-colors'
			>
				{isSubmitting ? "Submitting..." : "Submit Comment"}
			</button>
		</form>
	);
};