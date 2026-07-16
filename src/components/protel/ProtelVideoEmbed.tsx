import { resolveProjectVideoPosterUrl, resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelVideoAspect } from "@/types";

export function protelAspectClass(aspect: ProtelVideoAspect): string {
  return `protel-video--${aspect.replace(":", "-")}`;
}

export function ProtelVideoEmbed({
  title,
  videoUrl,
  aspectRatio = "16:9",
  framed = false,
  naturalSize = false,
}: {
  title?: string;
  videoUrl: string;
  aspectRatio?: ProtelVideoAspect;
  framed?: boolean;
  /** Bento: videonun kendi boyutu; container zorlaması yok. */
  naturalSize?: boolean;
}) {
  const src = resolveProjectVideoUrl(videoUrl);
  const poster = resolveProjectVideoPosterUrl(videoUrl);
  const frameClass = framed ? " protel-video--framed" : "";
  const naturalClass = naturalSize ? " protel-video--natural" : "";
  const aspectClass = protelAspectClass(aspectRatio);

  if (!src) {
    return (
      <div
        className={`protel-video protel-video--placeholder ${protelAspectClass(aspectRatio)}${frameClass}${naturalClass}`}
      >
        <span className="protel-video__placeholder-text">
          {title || "Video yakında eklenecek"}
        </span>
      </div>
    );
  }

  return (
    <figure
      className={`protel-video${naturalSize ? "" : ` ${aspectClass}`}${frameClass}${naturalClass}`}
    >
      <video
        src={src}
        poster={poster || undefined}
        controls
        playsInline
        preload="metadata"
        className="protel-video__el"
        aria-label={title || "Video"}
      />
      {title && !naturalSize ? (
        <figcaption className="protel-video__caption">{title}</figcaption>
      ) : null}
    </figure>
  );
}

export function ProtelVideoStack({
  items,
}: {
  items: Array<{ title: string; videoUrl: string; aspectRatio: ProtelVideoAspect }>;
}) {
  if (items.length === 0) {
    return <p className="protel-pitch__empty">Henüz video eklenmedi.</p>;
  }
  return (
    <div className="protel-video-stack">
      {items.map((item, i) => (
        <ProtelVideoEmbed
          key={`${item.title}-${i}`}
          title={item.title}
          videoUrl={item.videoUrl}
          aspectRatio={item.aspectRatio}
          framed
        />
      ))}
    </div>
  );
}
