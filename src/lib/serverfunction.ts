import {
	createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import db, { auth } from "./firebase";

// 👇🏻 Firebase Authentication functions for user registration, login, and logout
export const registerUser = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;
	const name = form.get("name") as string;

	try {
		const { user } = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		if (!user) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Failed to create user",
			};
        }
        await updateProfile(user, { displayName: name });
		return {
			code: "auth/success",
			status: 200,
			user,
			message: "Acount created successfully! 🎉",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to create user",
			error: err,
		};
	}
};

export const loginUser = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;
	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);
		if (!user) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Failed to login user",
			};
		}

		return {
			code: "auth/success",
			status: 200,
			user,
			message: "Logged in successfully! 🎉",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to login user",
			error: err,
		};
	}
};

export const logoutUser = async () => {
	try {
		await auth.signOut();
		return {
			code: "auth/success",
			status: 200,
			user: null,
			message: "Logged out successfully! 🎉",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to logout user",
			error: err,
		};
	}
};

// 👇🏻  Firebase Firestore functions for user data
export const addComment = async ({
	comment,
	userName,
	recordID,
}: CommentArgs) => {
	const commentRef = doc(db, "comments", recordID);
	const commentObj = {
		userName,
		comment,
		createdAt: new Date().toISOString(),
	};

	try {
		const commentDoc = await getDoc(commentRef);

		if (commentDoc.exists()) {
			// Document exists — append to comments array
			await updateDoc(commentRef, {
				comments: arrayUnion(commentObj),
			});

		} else {
			// Document doesn't exist — create it
			await setDoc(commentRef, {
				comments: [commentObj],
			});
		}
		return {
			success: true,
			message: "Comment added successfully.",
		};
	} catch (error) {
		return {
			success: false,
			message: "Failed to add comment.",
			error,
		};
	
	}
};

export const getComments = async (recordID: string) => { 
	const commentRef = doc(db, "comments", recordID);
	try {
		const commentDoc = await getDoc(commentRef);
			return {
				success: true,
				comments: commentDoc.data()?.comments || [],
			};
		
	} catch (error) {
		return {
			success: false,
			message: "Failed to fetch comments.",
			error,
		};
	}
	
}

export const addReaction = async (userId: string, recordID: string) => { 
	// add the userId to the reactions array in the recording document
	const docRef = doc(db, "comments", recordID);

	try {
		const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const reactions = [userId];
      await setDoc(docRef, { reactions });
      return { success: true, message: "Reaction added successfully.", reactions };
    }

    const reactions: string[] = docSnap.data()?.reactions || [];

    if (reactions.includes(userId)) {
      return { success: false, message: "You have already reacted to this recording.", reactions };
    }

    await updateDoc(docRef, { reactions: arrayUnion(userId) });
    return { success: true, message: "Reaction added successfully.", reactions: [...reactions, userId] };

  } catch (error) {
    return { success: false, message: "Failed to add reaction.", reactions: [], error };
  }

}

export const getReactions = async (recordID: string) => { 
	const docRef = doc(db, "comments", recordID);
	try {
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return {
				reactions: [],
			};
		}

		const reactions = docSnap.data()?.reactions || [];
		return {
			success: true,
			reactions,
		};

	} catch (error) {
		return {
			success: false,
			reactions: [],
			error,
		};
	}
}