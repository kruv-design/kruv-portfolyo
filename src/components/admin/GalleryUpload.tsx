"use client";

import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { toast } from "@/components/ui/Toast";

export function GalleryUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const { upload, busy } = useCloudinaryUpload();

  async function handleFiles(files: FileList) {
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      try {
        urls.push(await upload(f));
      } catch (err) {
        toast((err as Error).message, "error");
      }
    }
    if (urls.length) {
      onChange([...value, ...urls]);
      toast(urls.length > 1 ? `${urls.length} görsel yüklendi.` : "Görsel yüklendi.");
    }
  }

  return (
    <div>
      <div className="form-hint mb-2">
        Detay sayfasında gösterilir. Tıklanınca büyür.
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}
      >
        {value.map((src, i) => (
          <div
            key={src + i}
            className="relative overflow-hidden rounded-md"
            style={{
              aspectRatio: "4 / 3",
              background: "var(--gray-80)",
              border: "1px solid var(--adm-border)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label="Kaldır"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full b3 transition-colors hover:[background:var(--danger)]"
              style={{ background: "var(--gray-scrim-600)", color: "var(--gray-1000)" }}
            >
              ×
            </button>
          </div>
        ))}
        <label
          className="relative flex h4 cursor-pointer flex-col items-center justify-center rounded-md transition-colors"
          style={{
            aspectRatio: "4 / 3",
            border: "2px dashed var(--adm-border)",
            background: "var(--gray-50)",
            color: "var(--ink-faint)",
          }}
        >
          <div className="pointer-events-none relative z-0 flex flex-col items-center">
            <span>{busy ? "…" : "＋"}</span>
            <span className="b3 mt-1 lowercase">Ekle</span>
          </div>
          <input
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            disabled={busy}
            onChange={(e) => {
              if (e.target.files?.length) void handleFiles(e.target.files);
              e.target.value = "";
            }}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            aria-label="Galeriye görsel ekle"
          />
        </label>
      </div>
    </div>
  );
}
