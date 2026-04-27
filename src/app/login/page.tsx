import { LoginForm } from "./LoginForm";

export const metadata = { title: "Giriş" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "var(--adm-bg)" }}
    >
      <LoginForm next={next ?? "/admin"} />
    </main>
  );
}
