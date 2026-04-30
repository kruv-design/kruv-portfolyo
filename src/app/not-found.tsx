import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="serif" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
        404
      </h1>
      <p style={{ color: "var(--ink-soft)" }}>Proje bulunamadı.</p>
      <Link
        href="/works"
        className="mt-2 rounded-full px-4 py-1.5 text-[13px]"
        style={{ border: "1px solid var(--border)", color: "var(--ink-soft)" }}
      >
        ← Portföy
      </Link>
    </main>
  );
}
