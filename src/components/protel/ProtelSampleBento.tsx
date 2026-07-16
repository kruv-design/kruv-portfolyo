import type { ProtelSampleVideo, ProtelVideoAspect } from "@/types";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

function isPortrait(aspect: ProtelVideoAspect) {
  return aspect === "9:16" || aspect === "4:5";
}

function splitByOrientation(items: ProtelSampleVideo[]) {
  const left: ProtelSampleVideo[] = [];
  const right: ProtelSampleVideo[] = [];

  for (const item of items) {
    if (isPortrait(item.aspectRatio)) {
      left.push(item);
    } else {
      right.push(item);
    }
  }

  return { left, right };
}

export function ProtelSampleBento({ items }: { items: ProtelSampleVideo[] }) {
  if (items.length === 0) {
    return (
      <div className="protel-bento protel-bento--empty">
        <p className="protel-pitch__empty">Henüz örnek video eklenmedi.</p>
      </div>
    );
  }

  const { left, right } = splitByOrientation(items);

  return (
    <div className="protel-bento">
      {left.length > 0 ? (
        <div className="protel-bento__col protel-bento__col--left">
          {left.map((item, index) => (
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
      ) : null}
      {right.length > 0 ? (
        <div className="protel-bento__col protel-bento__col--right">
          {right.map((item, index) => (
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
      ) : null}
    </div>
  );
}
