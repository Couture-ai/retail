import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return `Today at ${date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })}`;
}

export function sanitizeLabel(input: string): string {
  return input
    .replace(/_/g, " ")                 // replace underscores with spaces
    .replace(/\s+/g, " ")               // collapse multiple spaces
    .trim()                             // remove leading/trailing spaces
    .replace(/\w\S*/g, (word) =>        // capitalize each word
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
}