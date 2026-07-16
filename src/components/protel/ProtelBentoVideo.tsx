"use client";

import { resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelSampleVideo } from "@/types";

export function ProtelBentoVideo({ item }: { item: ProtelSampleVideo }) {
  const src = resolveProjectVideoUrl(item.videoUrl);

  if (!src) {
    return (
      <div className="protel-video protel-video--placeholder protel-video--bento">
        <span className="protel-video__placeholder-text">
          {item.title || "Video yakında eklenecek"}
        </span>
      </div>
    );
  }

  return (
    <figure className="protel-video protel-video--bento">
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
