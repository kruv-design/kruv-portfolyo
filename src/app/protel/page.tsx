import { isProtelAuthed } from "@/lib/protel-auth";
import { getProtelPitch } from "@/lib/protel-queries";
import { ProtelUnlockForm } from "./ProtelUnlockForm";
import { ProtelPitchView } from "@/components/protel/ProtelPitchView";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ProtelPage() {
  const authed = await isProtelAuthed();
  if (!authed) {
    return <ProtelUnlockForm />;
  }

  const pitch = await getProtelPitch();
  return <ProtelPitchView pitch={pitch} />;
}
