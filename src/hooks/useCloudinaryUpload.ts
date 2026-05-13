"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = /^image\/(png|jpe?g|webp|avif|gif|heic|heif|tiff?)$/i;
const EXT_OK = /\.(png|jpe?g|webp|avif|gif|heic|heif|tiff?)$/i;

function isAcceptedImage(file: File): boolean {
  if (file.type && ACCEPTED.test(file.type)) return true;
  return EXT_OK.test(file.name);
}

export function useCloudinaryUpload() {
  const [busy, setBusy] = useState(false);

  const upload = useCallback(async (file: File): Promise<string> => {
    if (!isAcceptedImage(file)) {
      throw new Error(
        "Bu dosya türü desteklenmiyor. JPG, PNG, WEBP, HEIC veya GIF deneyin (tür boşsa dosya adına bakılır).",
      );
    }
    if (file.size > MAX_SIZE) {
      throw new Error("Görsel 8 MB sınırını aşıyor.");
    }

    setBusy(true);
    try {
      const sig = await api.signUpload();
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      form.append("upload_preset", sig.uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      const raw = await res.text();
      let json: Record<string, unknown> = {};
      try {
        if (raw) json = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        /* yanıt JSON değil */
      }
      if (!res.ok || !json.secure_url) {
        const errObj = json.error as { message?: string } | undefined;
        const msg =
          errObj?.message ??
          (typeof json.error === "string" ? json.error : null) ??
          (raw && raw.length < 400 ? raw : null) ??
          `Cloudinary yanıtı: ${res.status}`;
        throw new Error(msg);
      }
      return json.secure_url as string;
    } finally {
      setBusy(false);
    }
  }, []);

  return { upload, busy };
}
