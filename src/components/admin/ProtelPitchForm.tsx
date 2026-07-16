"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  ProtelAdminPitch,
  ProtelBrand,
  ProtelPitchSettings,
  ProtelVideoAspect,
} from "@/types";
import { Field } from "@/components/ui/Field";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { toast } from "@/components/ui/Toast";

const ASPECTS: ProtelVideoAspect[] = ["16:9", "9:16", "4:5", "1:1"];
const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "X", "YouTube"];

function AspectSelect({
  value,
  onChange,
}: {
  value: ProtelVideoAspect;
  onChange: (v: ProtelVideoAspect) => void;
}) {
  return (
    <select
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value as ProtelVideoAspect)}
    >
      {ASPECTS.map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </select>
  );
}

export function ProtelPitchForm({ initial }: { initial: ProtelAdminPitch }) {
  const [settings, setSettings] = useState<ProtelPitchSettings>(initial.settings);
  const [brands, setBrands] = useState<ProtelBrand[]>(initial.brands);
  const [pagePassword, setPagePassword] = useState(initial.pagePassword);
  const [pending, start] = useTransition();
  const router = useRouter();

  function patchBrand(id: string, patch: Partial<ProtelBrand>) {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await fetch("/api/protel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, brands, pagePassword }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(json.error ?? "Kaydedilemedi.", "error");
        return;
      }
      toast("Protel sayfası kaydedildi.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSave}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2" style={{ color: "var(--ink)" }}>
            Protel
          </h1>
          <p className="b2 mt-2" style={{ color: "var(--ink-faint)" }}>
            Gizli teklif sayfası —{" "}
            <a href="/protel" target="_blank" rel="noreferrer" className="underline">
              /protel
            </a>
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      <div className="adm-card mb-5 p-7">
        <div
          className="mb-5 border-b pb-3 b1 font-medium"
          style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
        >
          Sayfa şifresi
        </div>
        <Field label="Public /protel şifresi">
          <input
            type="text"
            className="form-input"
            value={pagePassword}
            onChange={(e) => setPagePassword(e.target.value)}
            autoComplete="off"
          />
        </Field>
        <p className="b3 mt-2" style={{ color: "var(--ink-faint)" }}>
          Protel&apos;e paylaşılacak şifre. Supabase&apos;de saklanır; Vercel env gerekmez.
        </p>
      </div>

      <div className="adm-card mb-5 p-7">
        <div
          className="mb-5 border-b pb-3 b1 font-medium"
          style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
        >
          Sayfa metinleri
        </div>
        <div className="flex flex-col gap-5">
          <Field label="Üst etiket (plus ikonlu satır)">
            <input
              className="form-input"
              value={settings.heroEyebrow}
              onChange={(e) =>
                setSettings((s) => ({ ...s, heroEyebrow: e.target.value }))
              }
              placeholder="Protel için örnek çalışmalar, üretim süreci ve teklif formu"
            />
          </Field>
          <Field label="Başlık (son satır mor vurgu)">
            <textarea
              className="form-input min-h-[72px]"
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings((s) => ({ ...s, heroTitle: e.target.value }))
              }
              placeholder={"Ürününüzün Potansiyelini\nSahneye Çıkarın"}
            />
          </Field>
          <Field label="Intro (paragraflar arası boş satır)">
            <textarea
              className="form-input min-h-[120px]"
              value={settings.heroIntro}
              onChange={(e) =>
                setSettings((s) => ({ ...s, heroIntro: e.target.value }))
              }
            />
          </Field>
        </div>
      </div>

      <div className="adm-card mb-5 p-7">
        <div
          className="mb-5 border-b pb-3 b1 font-medium"
          style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
        >
          Örnek videolar (bento grid — max 5)
        </div>
        <div className="flex flex-col gap-6">
          {settings.sampleVideos.map((video, i) => (
            <div
              key={i}
              className="rounded-lg p-4"
              style={{ border: "1px solid var(--adm-border)" }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="b2 font-medium">Video {i + 1}</span>
                <button
                  type="button"
                  className="b3 underline"
                  style={{ color: "var(--ink-faint)" }}
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      sampleVideos: s.sampleVideos.filter((_, j) => j !== i),
                    }))
                  }
                >
                  Kaldır
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Başlık">
                  <input
                    type="text"
                    className="form-input"
                    value={video.title}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        sampleVideos: s.sampleVideos.map((v, j) =>
                          j === i ? { ...v, title: e.target.value } : v,
                        ),
                      }))
                    }
                  />
                </Field>
                <Field label="En-boy">
                  <AspectSelect
                    value={video.aspectRatio}
                    onChange={(aspectRatio) =>
                      setSettings((s) => ({
                        ...s,
                        sampleVideos: s.sampleVideos.map((v, j) =>
                          j === i ? { ...v, aspectRatio } : v,
                        ),
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="mt-3">
                <VideoUpload
                  value={video.videoUrl}
                  onChange={(videoUrl) =>
                    setSettings((s) => ({
                      ...s,
                      sampleVideos: s.sampleVideos.map((v, j) =>
                        j === i ? { ...v, videoUrl } : v,
                      ),
                    }))
                  }
                  onRemove={() =>
                    setSettings((s) => ({
                      ...s,
                      sampleVideos: s.sampleVideos.map((v, j) =>
                        j === i ? { ...v, videoUrl: "" } : v,
                      ),
                    }))
                  }
                />
              </div>
            </div>
          ))}
          {settings.sampleVideos.length < 8 ? (
            <button
              type="button"
              className="btn btn-secondary self-start"
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  sampleVideos: [
                    ...s.sampleVideos,
                    { title: "", videoUrl: "", aspectRatio: "16:9" },
                  ],
                }))
              }
            >
              ＋ Örnek video ekle
            </button>
          ) : null}
        </div>
      </div>

      <div className="adm-card mb-5 p-7">
        <div
          className="mb-5 border-b pb-3 b1 font-medium"
          style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
        >
          Teklif bölümü
        </div>
        <div className="flex flex-col gap-5">
          <Field label="Başlık">
            <input
              type="text"
              className="form-input"
              value={settings.proposalTitle}
              onChange={(e) =>
                setSettings((s) => ({ ...s, proposalTitle: e.target.value }))
              }
            />
          </Field>
          <Field label="Fiyat (pill)">
            <input
              type="text"
              className="form-input"
              value={settings.proposalPrice}
              onChange={(e) =>
                setSettings((s) => ({ ...s, proposalPrice: e.target.value }))
              }
              placeholder="0.000 ₺"
            />
          </Field>
          <Field label="En-boy">
            <AspectSelect
              value={settings.proposalVideoAspect}
              onChange={(proposalVideoAspect) =>
                setSettings((s) => ({ ...s, proposalVideoAspect }))
              }
            />
          </Field>
          <VideoUpload
            value={settings.proposalVideoUrl}
            onChange={(proposalVideoUrl) =>
              setSettings((s) => ({ ...s, proposalVideoUrl }))
            }
            onRemove={() =>
              setSettings((s) => ({ ...s, proposalVideoUrl: "" }))
            }
          />
        </div>
      </div>

      {brands.map((brand) => (
        <BrandEditor
          key={brand.id || brand.slug}
          brand={brand}
          onChange={(patch) => patchBrand(brand.id, patch)}
        />
      ))}

      <div className="adm-card mb-5 p-7">
        <div
          className="mb-5 border-b pb-3 b1 font-medium"
          style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
        >
          Süreç adımları
        </div>
        <div className="mb-5">
          <Field label="Süre etiketi (sağ üst)">
            <input
              type="text"
              className="form-input"
              value={settings.processDuration}
              onChange={(e) =>
                setSettings((s) => ({ ...s, processDuration: e.target.value }))
              }
              placeholder="2/3 HAFTA"
            />
          </Field>
        </div>
        <div className="flex flex-col gap-4">
          {settings.processSteps.map((step, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <Field label={`Adım ${i + 1} — başlık`}>
                <input
                  type="text"
                  className="form-input"
                  value={step.title}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      processSteps: s.processSteps.map((st, j) =>
                        j === i ? { ...st, title: e.target.value } : st,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Açıklama">
                <input
                  type="text"
                  className="form-input"
                  value={step.description}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      processSteps: s.processSteps.map((st, j) =>
                        j === i ? { ...st, description: e.target.value } : st,
                      ),
                    }))
                  }
                />
              </Field>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}

function BrandEditor({
  brand,
  onChange,
}: {
  brand: ProtelBrand;
  onChange: (patch: Partial<ProtelBrand>) => void;
}) {
  return (
    <div className="adm-card mb-5 p-7">
      <div
        className="mb-5 border-b pb-3 b1 font-medium"
        style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
      >
        {brand.name}
      </div>

      <div className="mb-6">
        <p className="b2 mb-3 font-medium">Metrikler</p>
        <div className="flex flex-col gap-3">
          {brand.metrics.map((m, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                className="form-input"
                placeholder="Etiket"
                value={m.label}
                onChange={(e) =>
                  onChange({
                    metrics: brand.metrics.map((x, j) =>
                      j === i ? { ...x, label: e.target.value } : x,
                    ),
                  })
                }
              />
              <input
                type="text"
                className="form-input"
                placeholder="Değer"
                value={m.value}
                onChange={(e) =>
                  onChange({
                    metrics: brand.metrics.map((x, j) =>
                      j === i ? { ...x, value: e.target.value } : x,
                    ),
                  })
                }
              />
              <button
                type="button"
                className="b3 underline"
                style={{ color: "var(--ink-faint)" }}
                onClick={() =>
                  onChange({
                    metrics: brand.metrics.filter((_, j) => j !== i),
                  })
                }
              >
                Sil
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary self-start"
            onClick={() =>
              onChange({
                metrics: [...brand.metrics, { label: "", value: "" }],
              })
            }
          >
            ＋ Metrik
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="b2 mb-3 font-medium">Sosyal medya</p>
        <div className="flex flex-col gap-3">
          {brand.socialAccounts.map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <select
                className="form-input"
                value={s.platform}
                onChange={(e) =>
                  onChange({
                    socialAccounts: brand.socialAccounts.map((x, j) =>
                      j === i ? { ...x, platform: e.target.value } : x,
                    ),
                  })
                }
              >
                <option value="">Platform</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="@handle"
                value={s.handle}
                onChange={(e) =>
                  onChange({
                    socialAccounts: brand.socialAccounts.map((x, j) =>
                      j === i ? { ...x, handle: e.target.value } : x,
                    ),
                  })
                }
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  className="form-input min-w-0 flex-1"
                  placeholder="https://"
                  value={s.url}
                  onChange={(e) =>
                    onChange({
                      socialAccounts: brand.socialAccounts.map((x, j) =>
                        j === i ? { ...x, url: e.target.value } : x,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="b3 shrink-0 underline"
                  style={{ color: "var(--ink-faint)" }}
                  onClick={() =>
                    onChange({
                      socialAccounts: brand.socialAccounts.filter(
                        (_, j) => j !== i,
                      ),
                    })
                  }
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary self-start"
            onClick={() =>
              onChange({
                socialAccounts: [
                  ...brand.socialAccounts,
                  { platform: "Instagram", handle: "", url: "" },
                ],
              })
            }
          >
            ＋ Hesap
          </button>
        </div>
      </div>

      {[1, 2].map((slot) => {
        const titleKey = slot === 1 ? "video1Title" : "video2Title";
        const urlKey = slot === 1 ? "video1Url" : "video2Url";
        const aspectKey = slot === 1 ? "video1Aspect" : "video2Aspect";
        return (
          <div
            key={slot}
            className="mb-5 rounded-lg p-4"
            style={{ border: "1px solid var(--adm-border)" }}
          >
            <p className="b2 mb-3 font-medium">Video {slot}</p>
            <div className="mb-3 grid gap-4 sm:grid-cols-2">
              <Field label="Başlık">
                <input
                  type="text"
                  className="form-input"
                  value={brand[titleKey]}
                  onChange={(e) => onChange({ [titleKey]: e.target.value })}
                />
              </Field>
              <Field label="En-boy">
                <AspectSelect
                  value={brand[aspectKey]}
                  onChange={(v) => onChange({ [aspectKey]: v })}
                />
              </Field>
            </div>
            <VideoUpload
              value={brand[urlKey]}
              onChange={(v) => onChange({ [urlKey]: v })}
              onRemove={() => onChange({ [urlKey]: "" })}
            />
          </div>
        );
      })}
    </div>
  );
}
