"use client";

import { useMemo } from "react";
import type { ProtelSampleVideo } from "@/types";
import { ProtelBentoVideo } from "./ProtelBentoVideo";

function videoHaystack(item: ProtelSampleVideo): string {
  try {
    return decodeURIComponent(`${item.title} ${item.videoUrl}`).toLowerCase();
  } catch {
    return `${item.title} ${item.videoUrl}`.toLowerCase();
  }
}

function isLeftColumnVideo(item: ProtelSampleVideo): boolean {
  const haystack = videoHaystack(item);

  if (haystack.includes("fiyat_parite")) {
    return false;
  }

  if (haystack.includes("otelinizin") || haystack.includes("tten-2")) {
    return true;
  }

  return item.aspectRatio === "9:16" || item.aspectRatio === "4:5";
}

export function ProtelSampleBentoClient({ items }: { items: ProtelSampleVideo[] }) {
  const { left, right } = useMemo(() => {
    const leftItems: Array<{ item: ProtelSampleVideo; index: number }> = [];
    const rightItems: Array<{ item: ProtelSampleVideo; index: number }> = [];

    items.forEach((item, index) => {
      if (isLeftColumnVideo(item)) {
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
