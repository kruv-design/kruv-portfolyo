"use client";

import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { resolveProjectImageUrl } from "@/lib/project-images";
import { toast } from "@/components/ui/Toast";

export function CoverUpload({
  value,
  onChange,
  previewAlt = "Kapak",
}: {
  value: string;
  onChange: (url: string) => void;
  /** Önizleme ve file input erişilebilirlik metni */
  previewAlt?: string;
}) {
  const { upload, busy } = useCloudinaryUpload();

  const previewSrc = value ? resolveProjectImageUrl(value) : "";

  async function handleFile(file: File) {
    try {
      const url = await upload(file);
      onChange(url);
      toast("Görsel yüklendi.");
    } catch (err) {
      toast((err as Error).message, "error");
    }
  }

  return (
    <div>
      <label
        className="relative block cursor-pointer rounded-lg p-6 text-center transition-colors"
        style={{
          border: "2px dashed var(--adm-border)",
          background: "var(--gray-50)",
        }}
      >
        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt={previewAlt}
            className="pointer-events-none relative z-0 mx-auto block max-h-[200px] w-full rounded object-contain"
          />
        ) : (
          <div className="pointer-events-none relative z-0">
            <div className="mb-2 text-[2rem]">🖼</div>
            <div className="b2" style={{ color: "var(--ink-faint)" }}>
              Sürükle veya{" "}
              <strong style={{ color: "var(--accent)" }}>tıkla</strong>
            </div>
            <div className="form-hint mt-1">
              JPG, PNG, WEBP, HEIC — maks 8 MB
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*,.heic,.heif"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
          className="absolute inset-0 z-10 h-full min-h-[120px] w-full cursor-pointer opacity-0"
          aria-label={previewAlt + " seç"}
        />
        {busy && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-lg b2 font-medium"
            style={{ background: "var(--gray-scrim-800)", color: "var(--gray-1000)" }}
          >
            Yükleniyor…
          </div>
        )}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onChange(e.target.value.trim())}
        placeholder="https://… veya kruv-portfolio/public_id"
        className="form-input mt-1.5"
      />
      <p className="form-hint mt-1.5">
        Tam <strong>https://</strong> linki veya Cloudinary <strong>public_id</strong> (örn.{" "}
        <code className="text-xs">kruv-portfolio/ngxpgkjun4yt0zjld3a5</code>). Public_id için{" "}
        <code className="text-xs">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> (.env) tanımlı olmalı.
      </p>
      <p className="form-hint mt-1">
        Önizlemenin üzerine tıklayarak görseli değiştirebilirsiniz. Boş bırakırsanız bu slot sitede görünmez.
      </p>
    </div>
  );
}
