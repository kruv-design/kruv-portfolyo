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

function isPortraitVideo(item: ProtelSampleVideo): boolean {
  return item.aspectRatio === "9:16" || item.aspectRatio === "4:5";
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

type ColumnEntry = { item: ProtelSampleVideo; index: number };

function sortColumnItems(
  entries: ColumnEntry[],
  column: "left" | "right",
): ColumnEntry[] {
  return [...entries].sort((a, b) => {
    const aPortrait = isPortraitVideo(a.item);
    const bPortrait = isPortraitVideo(b.item);

    if (aPortrait !== bPortrait) {
      if (column === "left") {
        return aPortrait ? -1 : 1;
      }
      return aPortrait ? 1 : -1;
    }

    return a.index - b.index;
  });
}

export function ProtelSampleBentoClient({ items }: { items: ProtelSampleVideo[] }) {
  const { left, right } = useMemo(() => {
    const leftItems: ColumnEntry[] = [];
    const rightItems: ColumnEntry[] = [];

    items.forEach((item, index) => {
      const entry = { item, index };
      if (isLeftColumnVideo(item)) {
        leftItems.push(entry);
      } else {
        rightItems.push(entry);
      }
    });

    return {
      left: sortColumnItems(leftItems, "left"),
      right: sortColumnItems(rightItems, "right"),
    };
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
