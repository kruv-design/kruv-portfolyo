import { getProtelPitch } from "@/lib/protel-queries";
import { ProtelPitchForm } from "@/components/admin/ProtelPitchForm";

export const dynamic = "force-dynamic";

export default async function AdminProtelPage() {
  const pitch = await getProtelPitch();
  return <ProtelPitchForm initial={pitch} />;
}
