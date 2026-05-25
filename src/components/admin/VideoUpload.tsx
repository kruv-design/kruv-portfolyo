"use client";

import { useCloudinaryVideoUpload } from "@/hooks/useCloudinaryVideoUpload";
import { resolveProjectVideoUrl } from "@/lib/project-images";
import { toast } from "@/components/ui/Toast";

export function VideoUpload({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}) {
  const { upload, busy } = useCloudinaryVideoUpload();
  const previewSrc = value ? resolveProjectVideoUrl(value) : "";

  async function handleFile(file: File) {
    try {
      const url = await upload(file);
      onChange(url);
      toast("Video yüklendi.");
    } catch (err) {
      toast((err as Error).message, "error");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        className="relative block cursor-pointer rounded-lg p-4 text-center transition-colors"
        style={{
          border: "2px dashed var(--adm-border)",
          background: "var(--gray-50)",
        }}
      >
        {previewSrc ? (
          <video
            src={previewSrc}
            className="mx-auto max-h-40 w-full rounded-md object-contain"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
          />
        ) : (
          <span className="b3" style={{ color: "var(--ink-faint)" }}>
            {busy ? "Yükleniyor…" : "MP4 / WebM sürükle veya tıkla"}
          </span>
        )}
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </label>
      {previewSrc ? (
        <button
          type="button"
          className="b3 self-start underline"
          style={{ color: "var(--ink-faint)" }}
          onClick={onRemove}
        >
          Videoyu kaldır
        </button>
      ) : null}
    </div>
  );
}
