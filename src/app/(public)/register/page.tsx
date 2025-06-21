"use client";
import { registerUser } from "@/lib/serverfunction";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { showToast } from "@/lib/utils";

export default function Register() {
	const router = useRouter();
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const { user, message } = await registerUser(formData);
		if (user) {
			showToast("success", message);
			router.push("/login");
		} else {
			showToast("error", message);
			setButtonClicked(false);
		}
	};

	return (
		<section className='md:w-3/4 w-full h-screen flex flex-col justify-center md:px-8 px-6 items-center'>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Create your account
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='name' className='mb-2 opacity-60'>
					Name
				</label>
				<input
					required
					type='text'
					id='name'
					name='name'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>
				<label htmlFor='email' className='mb-2 opacity-60'>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='password' className='mb-2 opacity-60'>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
					name='password'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
				/>

				<button
					type='submit'
					className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
					disabled={buttonClicked}
				>
					{buttonClicked ? "Registering..." : "Sign up"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account?{" "}
					<Link href='/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}