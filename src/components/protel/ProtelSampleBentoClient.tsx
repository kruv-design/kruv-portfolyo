"use client";

import { useMemo } from "react";
import type { ProtelSampleVideo } from "@/types";
import { ProtelBentoVideo } from "./ProtelBentoVideo";

function isPortrait(item: ProtelSampleVideo): boolean {
  return item.aspectRatio === "9:16" || item.aspectRatio === "4:5";
}

export function ProtelSampleBentoClient({ items }: { items: ProtelSampleVideo[] }) {
  const { left, right } = useMemo(() => {
    const leftItems: Array<{ item: ProtelSampleVideo; index: number }> = [];
    const rightItems: Array<{ item: ProtelSampleVideo; index: number }> = [];

    items.forEach((item, index) => {
      const entry = { item, index };
      if (isPortrait(item)) {
        leftItems.push(entry);
      } else {
        rightItems.push(entry);
      }
    });

    return { left: leftItems, right: rightItems };
  }, [items]);

  return (
    <div className="protel-bento">
      <div className="protel-bento__col protel-bento__col--left">
        {left.map(({ item, index }) => (
          <ProtelBentoVideo
            key={`left-${index}-${item.videoUrl}`}
            item={item}
          />
        ))}
      </div>
      <div className="protel-bento__col protel-bento__col--right">
        {right.map(({ item, index }) => (
          <ProtelBentoVideo
            key={`right-${index}-${item.videoUrl}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
