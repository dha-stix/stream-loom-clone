"use client"
import { logoutUser } from "@/lib/serverfunction";
import AuthContext from "./AuthContext";
import { useContext } from "react";
import Link from "next/link";

export default function Nav() {
	const { user } = useContext(AuthContext);
	return (
		<nav className='flex items-center justify-between h-[10vh] md:px-8 px-2 py-4 border-b-[1px] border-gray-300 top-0 sticky bg-white z-10'>
			<Link href='/' className='font-bold text-2xl'>
				Loom Clone
			</Link>

			<div className='flex items-center gap-x-3'>
				<p className='text-sm text-gray-500'>{user?.displayName}</p>

				<button
					className='bg-red-600 text-sm hover:bg-red-500 text-white px-5 py-3 rounded-md cursor-pointer'
					onClick={logoutUser}
				>
					Log Out
				</button>
			</div>
		</nav>
	);
}