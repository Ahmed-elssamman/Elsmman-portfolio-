"use client";

import Image from "next/image";
import { useId, useState, type ChangeEvent } from "react";
import { IMAGE_ACCEPT, MAX_IMAGE_BYTES } from "./editor.control";

interface ProjectImageFieldProps {
  image: string;
  name: string;
  onChange: (image: string) => void;
  onUploading: (uploading: boolean) => void;
}

interface ImageUploadResponse {
  ok: boolean;
  image?: string;
  error?: string;
}

export function ProjectImageField({
  image,
  name,
  onChange,
  onUploading,
}: ProjectImageFieldProps) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.item(0);
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }
    setUploading(true);
    onUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: form,
      });
      const result: ImageUploadResponse = await response.json();
      if (!response.ok || !result.ok || !result.image) {
        setError(result.error || "The image could not be uploaded. Try again.");
        return;
      }
      onChange(result.image);
    } catch {
      setError(
        "The upload could not finish. Check your connection and try again.",
      );
    } finally {
      setUploading(false);
      onUploading(false);
    }
  }

  function remove() {
    onChange("");
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-ink">
        Project screenshot
      </label>
      <input
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={upload}
        disabled={uploading}
        aria-describedby={id + "-hint"}
        className="block w-full min-w-0 text-sm text-ink-mute"
      />
      <p id={id + "-hint"} className="text-xs text-ink-mute">
        PNG, JPEG, or WebP, up to 5 MB. Save changes after uploading.
      </p>
      <p role="status" className="text-sm text-ink-mute">
        {uploading ? "Uploading image…" : error}
      </p>
      {image && (
        <div className="space-y-2">
          <Image
            src={image}
            alt={(name || "Project") + " screenshot preview"}
            width={360}
            height={250}
            unoptimized
            className="h-auto w-full max-w-sm rounded border border-edge"
          />
          <button
            type="button"
            onClick={remove}
            disabled={uploading}
            className="border border-edge px-3 py-2 text-sm text-ink"
          >
            Remove screenshot
          </button>
        </div>
      )}
    </div>
  );
}
