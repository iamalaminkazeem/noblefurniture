"use client";
import React, { useState } from "react";
import { Upload, Check, X } from "lucide-react";

// Uploads a file to /api/admin/upload (ImageKit) and returns the resulting URL
// via onUploaded. Used in the admin product/blog forms.
export function ImageUploadField({ onUploaded, currentUrl }: { onUploaded: (url: string) => void; currentUrl?: string }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setPreview(data.url);
      onUploaded(data.url);
    } catch {
      setError("Upload failed. Check your ImageKit keys in .env.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs text-[#1E1E1E]/60 uppercase tracking-wide mb-1.5">Image</label>
      {preview && (
        <div className="relative w-32 h-32 mb-2">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => { setPreview(""); onUploaded(""); }} className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
            <X size={12} />
          </button>
        </div>
      )}
      <label className="inline-flex items-center gap-2 border border-dashed border-[#0B3D2E]/30 px-4 py-2.5 text-sm cursor-pointer hover:bg-[#F8F8F8]">
        {uploading ? "Uploading…" : <><Upload size={14} /> Choose file</>}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
