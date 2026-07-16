"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProtelSampleVideo, ProtelVideoAspect } from "@/types";
import { ProtelBentoVideo } from "./ProtelBentoVideo";

function guessPortrait(aspect: ProtelVideoAspect): boolean {
  return aspect === "9:16" || aspect === "4:5";
}

function isPortrait(
  item: ProtelSampleVideo,
  index: number,
  orientations: Record<string, boolean>,
): boolean {
  const key = `${index}-${item.videoUrl}`;
  const detected = orientations[key];
  if (detected !== undefined) return detected;
  return guessPortrait(item.aspectRatio);
}

export function ProtelSampleBentoClient({ items }: { items: ProtelSampleVideo[] }) {
  const [orientations, setOrientations] = useState<Record<string, boolean>>({});

  const onOrientation = useCallback((key: string, portrait: boolean) => {
    setOrientations((prev) =>
      prev[key] === portrait ? prev : { ...prev, [key]: portrait },
    );
  }, []);

  const { left, right } = useMemo(() => {
    const leftItems: Array<{ item: ProtelSampleVideo; index: number }> = [];
    const rightItems: Array<{ item: ProtelSampleVideo; index: number }> = [];

    items.forEach((item, index) => {
      if (isPortrait(item, index, orientations)) {
        leftItems.push({ item, index });
      } else {
        rightItems.push({ item, index });
      }
    });

    return { left: leftItems, right: rightItems };
  }, [items, orientations]);

  return (
    <div className="protel-bento">
      <div className="protel-bento__col protel-bento__col--left">
        {left.map(({ item, index }) => {
          const key = `${index}-${item.videoUrl}`;
          return (
            <ProtelBentoVideo
              key={`left-${key}`}
              item={item}
              videoKey={key}
              onOrientation={onOrientation}
            />
          );
        })}
      </div>
      <div className="protel-bento__col protel-bento__col--right">
        {right.map(({ item, index }) => {
          const key = `${index}-${item.videoUrl}`;
          return (
            <ProtelBentoVideo
              key={`right-${key}`}
              item={item}
              videoKey={key}
              onOrientation={onOrientation}
            />
          );
        })}
      </div>
    </div>
  );
}
