import { Video } from "lucide-react";
import Link from "next/link";
import { formatReadableTime } from "@/lib/utils";

export default function Recordings({
	recordings,
}: {
	recordings: CallWithRecordings[];
}) {
	return (
		<div className='flex flex-col w-full gap-y-3'>
			{recordings.length > 0 ? recordings.map((data, idx) => (
				<Item key={idx} data={data} />
			))
				: (
				<p className='text-red-500 text-sm'>No existing recordings </p>
			)}
		</div>
	);
}

const Item = ({ data }: { data: CallWithRecordings }) => {
	return (
		<div className='w-full flex items-center justify-between rounded-sm bg-gray-100 hover:shadow-md p-4'>
			<section>
				<h3 className='font-semibold text-lg'>Call Session: {data.call.state.custom.title}</h3>

				<p className='text-sm text-blue-600 mb-4'>
					Recordings: ({data.recordings.length})
				</p>
				

				{data.recordings.length > 0 ? (
					<div className='flex flex-col gap-y-2'>
						{data.recordings.map((recording, idx) => (
							<Link
								href={`/record/${data.call.id}?search=${recording.session_id}`}
								target='_blank'
								className='flex items-center text-red-400 gap-x-2 underline hover:text-red-600'
								key={idx}
							>
								<Video size={20} className='text-red-500' />

								<p className=' text-red-400'>
									{formatReadableTime(recording.start_time)}
								</p>
							</Link>
							
						))}
						
					</div>
				) : (
					<p className='text-xs text-gray-500'> No recordings available</p>
				)}
			</section>

		</div>
	);
};