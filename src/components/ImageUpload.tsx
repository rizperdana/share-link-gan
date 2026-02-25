"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/supabase/upload";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  bucket?: string;
  folder?: string;
  shape?: "circle" | "square";
  size?: number;
  label?: string;
}

export default function ImageUpload({
  currentUrl,
  onUpload,
  bucket = "avatars",
  folder = "",
  shape = "circle",
  size = 96,
  label = "Upload image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const url = await uploadImage(file, bucket, folder);
      onUpload(url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-wrapper">
      <div
        className={`image-upload ${shape}`}
        style={{ width: size, height: size }}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={label}
      >
        {uploading ? (
          <div className="image-upload-loading">
            <div className="spinner" style={{ width: 24, height: 24 }} />
          </div>
        ) : currentUrl ? (
          <>
            <img src={currentUrl} alt="" className="image-upload-preview" />
            <div className="image-upload-overlay">
              <span>📷</span>
            </div>
          </>
        ) : (
          <div className="image-upload-placeholder">
            <span style={{ fontSize: size > 60 ? "1.5rem" : "1rem" }}>📷</span>
            <span style={{ fontSize: "0.7rem", marginTop: 4 }}>{label}</span>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />
      {error && (
        <p className="form-error" style={{ textAlign: "center", marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
