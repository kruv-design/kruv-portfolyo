"use client";

import { resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelSampleVideo } from "@/types";

export function ProtelBentoVideo({ item }: { item: ProtelSampleVideo }) {
  const src = resolveProjectVideoUrl(item.videoUrl);
  const isPortrait =
    item.aspectRatio === "9:16" || item.aspectRatio === "4:5";
  const orientationClass = isPortrait
    ? " protel-video--portrait"
    : " protel-video--landscape";

  if (!src) {
    return (
      <div
        className={`protel-video protel-video--placeholder protel-video--bento${orientationClass}`}
      >
        <span className="protel-video__placeholder-text">
          {item.title || "Video yakında eklenecek"}
        </span>
      </div>
    );
  }

  return (
    <figure className={`protel-video protel-video--bento${orientationClass}`}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="protel-video__el"
        aria-label={item.title || "Video"}
      />
    </figure>
  );
}
