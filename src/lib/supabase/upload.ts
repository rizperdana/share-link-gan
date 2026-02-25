import { createClient } from "./client";

/**
 * Upload a file to Supabase Storage and return its public URL.
 */
export async function uploadImage(
  file: File,
  bucket: string = "avatars",
  folder: string = "",
): Promise<string> {
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
