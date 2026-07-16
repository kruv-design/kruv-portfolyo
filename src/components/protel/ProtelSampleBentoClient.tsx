"use client";

import { useMemo } from "react";
import type { ProtelSampleVideo, ProtelVideoAspect } from "@/types";
import { ProtelBentoVideo } from "./ProtelBentoVideo";

function isPortrait(aspect: ProtelVideoAspect): boolean {
  return aspect === "9:16" || aspect === "4:5";
}

export function ProtelSampleBentoClient({ items }: { items: ProtelSampleVideo[] }) {
  const { left, right } = useMemo(() => {
    const leftItems: Array<{ item: ProtelSampleVideo; index: number }> = [];
    const rightItems: Array<{ item: ProtelSampleVideo; index: number }> = [];

    items.forEach((item, index) => {
      if (isPortrait(item.aspectRatio)) {
        leftItems.push({ item, index });
      } else {
        rightItems.push({ item, index });
      }
    });

    return { left: leftItems, right: rightItems };
  }, [items]);

  return (
    <div className="protel-bento">
      <div className="protel-bento__col protel-bento__col--left">
        {left.map(({ item, index }) => {
          const key = `${index}-${item.videoUrl}`;
          return <ProtelBentoVideo key={`left-${key}`} item={item} />;
        })}
      </div>
      <div className="protel-bento__col protel-bento__col--right">
        {right.map(({ item, index }) => {
          const key = `${index}-${item.videoUrl}`;
          return <ProtelBentoVideo key={`right-${key}`} item={item} />;
        })}
      </div>
    </div>
  );
}
