import { DropPackForm } from "@/components/admin/DropPackForm";

export default function AdminNewDropPackPage() {
  return (
    <>
      <h1 className="h2 mb-8" style={{ color: "var(--ink)" }}>
        Yeni paket
      </h1>
      <DropPackForm mode="create" />
    </>
  );
}
