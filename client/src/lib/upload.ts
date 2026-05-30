const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/** True bila kredensial Cloudinary sudah dikonfigurasi via env. */
export const uploadConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Upload sebuah gambar langsung ke Cloudinary (unsigned upload) dari browser
 * dan kembalikan `secure_url` yang bisa disimpan ke kolom coverImage.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!uploadConfigured) {
    throw new Error(
      "Upload belum dikonfigurasi. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET as string);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body,
  });

  const json = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message ?? "Gagal mengunggah gambar");
  }
  return json.secure_url;
}
