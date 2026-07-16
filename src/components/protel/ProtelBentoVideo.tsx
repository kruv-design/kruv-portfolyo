"use client";

import { resolveProjectVideoPosterUrl, resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelSampleVideo } from "@/types";
import { protelAspectClass } from "./ProtelVideoEmbed";

function bentoOrientationClass(item: ProtelSampleVideo): string {
  return item.aspectRatio === "9:16" || item.aspectRatio === "4:5"
    ? " protel-video--portrait"
    : " protel-video--landscape";
}

export function ProtelBentoVideo({ item }: { item: ProtelSampleVideo }) {
  const src = resolveProjectVideoUrl(item.videoUrl);
  const poster = resolveProjectVideoPosterUrl(item.videoUrl);
  const orientationClass = bentoOrientationClass(item);
  const aspectClass = protelAspectClass(item.aspectRatio);

  if (!src) {
    return (
      <div
        className={`protel-video protel-video--placeholder protel-video--bento ${aspectClass}${orientationClass}`}
      >
        <span className="protel-video__placeholder-text">
          {item.title || "Video yakında eklenecek"}
        </span>
      </div>
    );
  }

  return (
    <figure
      className={`protel-video protel-video--bento protel-video--natural ${aspectClass}${orientationClass}`}
    >
      <video
        src={src}
        poster={poster || undefined}
        controls
        playsInline
        preload="metadata"
        className="protel-video__el"
        aria-label={item.title || "Video"}
      />
    </figure>
  );
}
