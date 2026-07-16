import type { ProtelSampleVideo } from "@/types";
import { ProtelSampleBentoClient } from "./ProtelSampleBentoClient";

export function ProtelSampleBento({ items }: { items: ProtelSampleVideo[] }) {
  if (items.length === 0) {
    return (
      <div className="protel-bento protel-bento--empty">
        <p className="protel-pitch__empty">Henüz örnek video eklenmedi.</p>
      </div>
    );
  }

  return <ProtelSampleBentoClient items={items} />;
}
