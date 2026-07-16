import { getProtelAdminPitch } from "@/lib/protel-queries";
import { ProtelPitchForm } from "@/components/admin/ProtelPitchForm";

export const dynamic = "force-dynamic";

export default async function AdminProtelPage() {
  const pitch = await getProtelAdminPitch();
  return <ProtelPitchForm initial={pitch} />;
}
