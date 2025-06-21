import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSlug = (title: string): string => {
  // Convert title to lowercase and replace spaces and non-alphanumerics with hyphens
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // remove special characters
    .replace(/\s+/g, '-');       // replace spaces with hyphens

  // Generate 4 random lowercase letters
  const randomLetters = Array.from({ length: 4 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');

  return `${slug}-${randomLetters}`;
}

export const formatReadableTime = (isoTime: string): string => {
  const date = new Date(isoTime);

  // Options for a readable date-time format
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString(undefined, options);
}

type ToastType = "success" | "error";

export const showToast = (type: ToastType, message: string) => {
  toast[type](message, {
    duration: 3000,
    position: "top-right",
    style: {
      backgroundColor: type === "success" ? "#16A34A" : "#DC2626",
      color: "white",
    },
  });
};