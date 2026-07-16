import type { ProtelSampleVideo } from "@/types";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

export function ProtelSampleBento({ items }: { items: ProtelSampleVideo[] }) {
  if (items.length === 0) {
    return (
      <div className="protel-bento protel-bento--empty">
        <p className="protel-pitch__empty">Henüz örnek video eklenmedi.</p>
      </div>
    );
  }

  const leftItems = [items[0], items[4]].filter(Boolean);
  const rightItems = items.slice(1, 4).filter(Boolean);

  return (
    <div className="protel-bento">
      <div className="protel-bento__col protel-bento__col--left">
        {leftItems.map((item, index) => (
          <ProtelVideoEmbed
            key={`left-${index}-${item.videoUrl}`}
            title={item.title}
            videoUrl={item.videoUrl}
            aspectRatio={item.aspectRatio}
            framed
            naturalSize
          />
        ))}
      </div>
      <div className="protel-bento__col protel-bento__col--right">
        {rightItems.map((item, index) => (
          <ProtelVideoEmbed
            key={`right-${index}-${item.videoUrl}`}
            title={item.title}
            videoUrl={item.videoUrl}
            aspectRatio={item.aspectRatio}
            framed
            naturalSize
          />
        ))}
      </div>
    </div>
  );
}
