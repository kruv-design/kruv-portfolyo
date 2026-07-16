"use client";

import { useCallback } from "react";
import { resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelSampleVideo } from "@/types";

export function ProtelBentoVideo({
  item,
  videoKey,
  onOrientation,
}: {
  item: ProtelSampleVideo;
  videoKey: string;
  onOrientation: (key: string, portrait: boolean) => void;
}) {
  const src = resolveProjectVideoUrl(item.videoUrl);

  const handleLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const { videoWidth, videoHeight } = e.currentTarget;
      if (videoWidth > 0 && videoHeight > 0) {
        onOrientation(videoKey, videoHeight > videoWidth);
      }
    },
    [onOrientation, videoKey],
  );

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
        onLoadedMetadata={handleLoadedMetadata}
      />
    </figure>
  );
}
