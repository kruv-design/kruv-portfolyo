"use client";

import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { toast } from "@/components/ui/Toast";

export function CoverUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const { upload, busy } = useCloudinaryUpload();

  async function handleFile(file: File) {
    try {
      const url = await upload(file);
      onChange(url);
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
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Kapak"
            className="mx-auto block max-h-[200px] w-full rounded object-contain"
          />
        ) : (
          <>
            <div className="mb-2 text-[2rem]">🖼</div>
            <div className="text-[13px]" style={{ color: "var(--ink-faint)" }}>
              Sürükle veya{" "}
              <strong style={{ color: "var(--accent)" }}>tıkla</strong>
            </div>
            <div className="form-hint mt-1">
              JPG, PNG, WEBP — maks 8 MB
            </div>
          </>
        )}
        {busy && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg text-[12px] font-medium"
            style={{ background: "var(--gray-scrim-800)", color: "var(--gray-1000)" }}
          >
            Yükleniyor…
          </div>
        )}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="ya da görsel URL'si girin"
        className="form-input mt-1.5"
      />
    </div>
  );
}
