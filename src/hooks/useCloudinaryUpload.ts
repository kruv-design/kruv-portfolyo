"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = /^image\/(png|jpe?g|webp|avif|gif)$/i;

export function useCloudinaryUpload() {
  const [busy, setBusy] = useState(false);

  const upload = useCallback(async (file: File): Promise<string> => {
    if (!ACCEPTED.test(file.type)) {
      throw new Error("Sadece JPG, PNG, WEBP, AVIF desteklenir.");
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
      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        throw new Error(json.error?.message ?? "Yükleme başarısız.");
      }
      return json.secure_url as string;
    } finally {
      setBusy(false);
    }
  }, []);

  return { upload, busy };
}
