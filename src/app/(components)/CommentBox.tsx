import { formatReadableTime } from "@/lib/utils";

export default function CommentBox({ comments }: { comments: CommentArgs[] }) {
	return (
		<div className='w-full flex flex-wrap items-center justify-center mb-4'>
			{comments.map((comment, index) => (
				<div
					className='lg:w-[450px] w-full bg-gray-100 p-4 rounded-xl hover:bg-gray-200 shadow-sm my-2 mx-[4px] text-center'
					key={index}
				>
					<p className='italic opacity-70 mb-2'>{comment.comment}</p>

					<p className='text-xs opacity-60'>By: {comment.userName}</p>
					<p className='text-xs text-blue-400 '>
						{formatReadableTime(comment?.createdAt as string)}
					</p>
				</div>
			))}
		</div>
	);
}