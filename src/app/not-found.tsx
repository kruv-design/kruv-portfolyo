import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="h1">404</h1>
      <p className="b1" style={{ color: "var(--b1-color)" }}>
        Proje bulunamadı.
      </p>
      <Link
        href="/works"
        className="b2 mt-2 rounded-full px-4 py-1.5"
        style={{ border: "1px solid var(--border)", color: "var(--ink-soft)" }}
      >
        ← Portföy
      </Link>
    </main>
  );
}
