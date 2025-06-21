import { AuthProvider } from "../(components)/AuthContext";
import type { Metadata } from "next";
import { StreamVideoProvider } from "../(stream)/StreamVideoProvider";

export const metadata: Metadata = {
	title: "Dashboard | Loom Clone",
	description: "Dashboard for Loom Clone application",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<StreamVideoProvider>
			<main>
				{children}
				</main>
			</StreamVideoProvider>
		</AuthProvider>
	);
}