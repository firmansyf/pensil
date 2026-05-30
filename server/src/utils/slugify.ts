/** Ubah teks menjadi slug URL-friendly. */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tambahkan suffix acak pendek agar slug unik. */
export function uniqueSlug(text: string): string {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slugify(text)}-${suffix}`;
}
