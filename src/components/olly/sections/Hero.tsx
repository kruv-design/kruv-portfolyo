"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/olly/ui/Container";
import { Button } from "@/components/olly/ui/Button";
import { Input } from "@/components/olly/ui/Input";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";

const waitlistSchema = z.object({
  email: z.string().min(1, "E-posta gerekli").email("Geçerli bir e-posta gir"),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

const avatars = [
  ollyFigma.avatar03,
  ollyFigma.avatar10,
  ollyFigma.avatar12,
  ollyFigma.avatar05,
  ollyFigma.avatar22,
  ollyFigma.avatar10,
] as const;

export function Hero() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: WaitlistValues) {
    setStatus("idle");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (data.error === "duplicate") {
        setStatus("error");
        setMessage("Bu e-posta zaten listede. Gelen kutunu kontrol et.");
        return;
      }
      setStatus("error");
      setMessage("Bir sorun oluştu. Lütfen tekrar dene.");
    } catch {
      setStatus("error");
      setMessage("Ağ hatası. Bağlantını kontrol edip tekrar dene.");
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-olly-canvas pb-olly-16 pt-olly-10 md:pb-olly-24 md:pt-olly-12"
      aria-labelledby="olly-hero-heading"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-olly-32 w-full max-w-none -translate-x-1/2 opacity-40 md:h-[28rem] md:opacity-55">
        <Image
          src={ollyFigma.heroBackdrop}
          alt=""
          fill
          className="object-contain object-top"
          sizes="100vw"
          priority
        />
      </div>

      <Container className="relative z-10 flex flex-col items-center">
        <div className="relative mx-auto flex w-full max-w-olly-phone flex-col items-center md:max-w-none md:min-h-[26rem]">
          <div className="relative flex aspect-square w-full max-w-olly-hero-orbit items-center justify-center md:max-w-olly-hero-orbit-md">
            <div className="absolute inset-olly-4 flex items-center justify-center md:inset-olly-8">
              <Image
                src={ollyFigma.ellipseOrbitOuter}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 32rem"
              />
            </div>
            <div className="absolute inset-[18%] flex items-center justify-center">
              <Image
                src={ollyFigma.ellipseOrbitMid}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 70vw, 24rem"
              />
            </div>
            <div className="absolute inset-[8%] flex items-center justify-center opacity-90">
              <Image
                src={ollyFigma.ellipseGlow}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 95vw, 36rem"
              />
            </div>

            {avatars.map((src, i) => {
              const step = 360 / avatars.length;
              const angle = i * step;
              return (
                <div
                  key={`${src}-${i}`}
                  className="pointer-events-none absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--olly-orbit-r))) rotate(${-angle}deg)`,
                  }}
                >
                  <div
                    className="olly-orbit-float overflow-hidden rounded-olly-full border border-olly-gray-800 shadow-olly-md"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  >
                    <div className="relative h-olly-12 w-olly-12 md:h-olly-16 md:w-olly-16">
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 rounded-olly-full"
                        style={{
                          background:
                            "color-mix(in srgb, var(--color-gray-0) 20%, transparent)",
                        }}
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 -mt-olly-12 flex w-full max-w-xl flex-col items-center text-center md:-mt-olly-20 md:max-w-2xl">
            <Typography
              id="olly-hero-heading"
              variant="h1"
              className="max-w-3xl text-balance text-olly-ink"
            >
              Doğru insanlarla bağlantı kur!
            </Typography>
            <Typography variant="b1" className="mt-olly-4 text-olly-muted">
              Network&apos;ünü büyüt...
            </Typography>

            <div className="mt-olly-8 w-full max-w-lg">
              {status === "success" ? (
                <Typography
                  variant="b1"
                  className="rounded-olly-full border border-olly-primary/50 bg-olly-surface px-olly-6 py-olly-5 text-olly-bright"
                  role="status"
                >
                  ✓ Listeye eklendin! Mailini kontrol et.
                </Typography>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-olly-3 md:flex-row md:items-stretch md:rounded-olly-full md:bg-olly-form-pill md:p-olly-1"
                  noValidate
                >
                  <div className="relative flex-1 md:flex md:items-center md:pl-olly-6">
                    <Input
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="Mail adresiniz..."
                      aria-invalid={Boolean(form.formState.errors.email)}
                      aria-describedby={
                        form.formState.errors.email || message
                          ? "hero-email-error"
                          : undefined
                      }
                      className="rounded-olly-full border-olly-line bg-olly-surface md:border-transparent md:bg-transparent"
                      {...form.register("email")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full shrink-0 rounded-olly-full md:w-auto"
                    disabled={form.formState.isSubmitting}
                  >
                    Bekleme listesine gir
                  </Button>
                </form>
              )}
              {(form.formState.errors.email?.message ||
                (status === "error" && message)) && (
                <Typography
                  id="hero-email-error"
                  variant="b3"
                  className="mt-olly-3 text-left text-olly-danger"
                  role="alert"
                >
                  {message || form.formState.errors.email?.message}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
