"use client";
import { useGetRecordings } from "@/app/(stream)/useGetRecordings";
import Recordings from "@/app/(components)/Recordings";
import AuthContext from "@/app/(components)/AuthContext";
import { logoutUser } from "@/lib/serverfunction";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Dashboard() {
	const { user, loading } = useContext(AuthContext);
	const { callWithRecordings, isLoading } = useGetRecordings(
		user?.uid as string
	);

	if (loading || isLoading) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<Loader2 className='animate-spin text-blue-500' size={32} />
			</div>
		);
	}

	return (
		<main className='w-full h-screen'>
			<Navigation />
			<div className=' h-[90vh] md:px-8 px-3 py-4 '>
				<h2 className='text-2xl text-blue-500 font-bold'>Recordings</h2>
				<p className='opacity-60 text-xs mb-6'>
					Manage all your video recordings
				</p>

				<Recordings recordings={callWithRecordings} />
			</div>
		</main>
	);
}

const Navigation = () => {
	return (
		<nav className='flex items-center justify-between h-[10vh] md:px-8 px-2 py-4 border-b-[1px] border-gray-300 top-0 sticky bg-white z-10'>
			<Link href='/' className='font-bold text-2xl'>
				Loom Clone
			</Link>

			<div className='flex items-center gap-x-3'>
				<Link
					href='/record'
					className='bg-blue-500 text-sm hover:bg-blue-400 text-white px-5 py-3 rounded-md cursor-pointer'
					// onClick={logoutUser}
				>
					New Recording
				</Link>

				<button
					className='bg-red-600 text-sm hover:bg-red-500 text-white px-5 py-3 rounded-md cursor-pointer'
					onClick={logoutUser}
				>
					Log Out
				</button>
			</div>
		</nav>
	);
};