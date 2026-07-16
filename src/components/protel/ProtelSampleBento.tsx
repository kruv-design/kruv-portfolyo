import type { ProtelSampleVideo, ProtelVideoAspect } from "@/types";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

const BENTO_SLOTS: Array<{ key: string; aspect: ProtelVideoAspect; className: string }> = [
  { key: "p1", aspect: "9:16", className: "protel-bento__cell--p1" },
  { key: "l1", aspect: "16:9", className: "protel-bento__cell--l1" },
  { key: "l2", aspect: "16:9", className: "protel-bento__cell--l2" },
  { key: "l3", aspect: "16:9", className: "protel-bento__cell--l3" },
  { key: "p2", aspect: "9:16", className: "protel-bento__cell--p2" },
];

export function ProtelSampleBento({ items }: { items: ProtelSampleVideo[] }) {
  if (items.length === 0) {
    return (
      <div className="protel-bento protel-bento--empty">
        <p className="protel-pitch__empty">Henüz örnek video eklenmedi.</p>
      </div>
    );
  }

  return (
    <div className="protel-bento">
      {BENTO_SLOTS.map((slot, index) => {
        const item = items[index];
        return (
          <div key={slot.key} className={`protel-bento__cell ${slot.className}`}>
            <ProtelVideoEmbed
              title={item?.title}
              videoUrl={item?.videoUrl ?? ""}
              aspectRatio={item?.aspectRatio ?? slot.aspect}
              framed
            />
          </div>
        );
      })}
    </div>
  );
}
