"use client";

import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
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
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
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
        placeholder="ya da görsel URL'si girin"
        className="form-input mt-1.5"
      />
      <p className="form-hint mt-1.5">
        URL içinde <strong>boşluk</strong> olmamalı (yapıştırınca kayıt reddedilebilir). Şüpheliyse alanı
        silip yeniden yükleyin veya Cloudinary’den linki kopyalayın.
      </p>
      <p className="form-hint mt-1">
        Önizlemenin üzerine tıklayarak görseli değiştirebilirsiniz. Boş bırakırsanız bu slot sitede görünmez.
      </p>
    </div>
  );
}
