import Link from "next/link";

export default function Home() {
	return (
		<main className='w-full h-screen'>
			<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
				<Link href='/' className='font-bold text-2xl'>
					Loom Clone
				</Link>

				<Link
					href='https://github.com/dha-stix/stream-games'
					target='_blank'
					className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'
				>
					Source Code
				</Link>
			</nav>

			<section className='h-[90vh] text-center w-full py-8 lg:px-[50px] px-4 flex flex-col items-center justify-center'>
				<h1 className='text-5xl lg:text-7xl font-extrabold text-blue-500 mb-5'>
					Seamless Video Upload and Sharing
				</h1>
				<p className='opacity-50 text-lg lg:text-2xl '>
					Easily upload, manage, and share your videos &mdash; built for
					creators and teams.
				</p>
				<p className='opacity-50 text-lg lg:text-2xl '>
					Just record, hit share, and you&apos;re done. Stream SDK makes it
					smooth and simple.
				</p>

				<div className='flex items-center justify-center mt-8'>
					<Link
						href='/login'
						className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md cursor-pointer'
					>
						Log in
					</Link>
					<Link
						href='/register'
						className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md cursor-pointer ml-5'
					>
						Create Account
					</Link>
				</div>
			</section>
		</main>
	);
}