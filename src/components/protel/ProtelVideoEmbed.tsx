import { resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelVideoAspect } from "@/types";

export function protelAspectClass(aspect: ProtelVideoAspect): string {
  return `protel-video--${aspect.replace(":", "-")}`;
}

export function ProtelVideoEmbed({
  title,
  videoUrl,
  aspectRatio = "16:9",
}: {
  title?: string;
  videoUrl: string;
  aspectRatio?: ProtelVideoAspect;
}) {
  const src = resolveProjectVideoUrl(videoUrl);
  if (!src) {
    return (
      <div
        className={`protel-video protel-video--placeholder ${protelAspectClass(aspectRatio)}`}
      >
        <span className="b2">{title || "Video yakında eklenecek"}</span>
      </div>
    );
  }

  return (
    <figure className={`protel-video ${protelAspectClass(aspectRatio)}`}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="protel-video__el"
        aria-label={title || "Video"}
      />
      {title ? <figcaption className="b2 protel-video__caption">{title}</figcaption> : null}
    </figure>
  );
}

export function ProtelVideoStack({
  items,
}: {
  items: Array<{ title: string; videoUrl: string; aspectRatio: ProtelVideoAspect }>;
}) {
  if (items.length === 0) {
    return <p className="b1 protel-pitch__empty">Henüz video eklenmedi.</p>;
  }
  return (
    <div className="protel-video-stack">
      {items.map((item, i) => (
        <ProtelVideoEmbed
          key={`${item.title}-${i}`}
          title={item.title}
          videoUrl={item.videoUrl}
          aspectRatio={item.aspectRatio}
        />
      ))}
    </div>
  );
}
