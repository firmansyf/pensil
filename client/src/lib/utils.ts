import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan className dengan dukungan kondisional + dedup Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format tanggal singkat dalam Bahasa Indonesia. */
export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
