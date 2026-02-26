import { createClient } from "./client";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload a file to Supabase Storage and return its public URL.
 */
export async function uploadImage(
  file: File,
  bucket: string = "sharelinkgan_bucket",
  folder: string = "",
): Promise<string> {
  // Validate file type
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, GIF, and SVG images are allowed");
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    throw new Error("Image must be under 5MB");
  }

  const supabase = createClient();

  // Generate a unique filename
  const ext = file.name.split(".").pop() || "png";
  const name = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(name, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return data.publicUrl;
}
