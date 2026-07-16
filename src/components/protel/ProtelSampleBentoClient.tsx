"use client";

import { useMemo } from "react";
import type { ProtelSampleVideo } from "@/types";
import { ProtelBentoVideo } from "./ProtelBentoVideo";

function isPortrait(item: ProtelSampleVideo): boolean {
  return item.aspectRatio === "9:16" || item.aspectRatio === "4:5";
}

function portraitSortRank(item: ProtelSampleVideo): number {
  const haystack = `${item.title} ${item.videoUrl}`.toLowerCase();
  if (haystack.includes("rate_coach") || haystack.includes("rate coach")) {
    return 0;
  }
  if (haystack.includes("fiyat_parite") || haystack.includes("fiyat parite")) {
    return 1;
  }
  if (haystack.includes("karsinda_olly") || haystack.includes("karşında olly")) {
    return 2;
  }
  if (haystack.includes("otelinizin")) return 3;
  if (haystack.includes("rate_shopper") || haystack.includes("rate shopper")) {
    return 4;
  }
  return 99;
}

function landscapeSortRank(item: ProtelSampleVideo): number {
  const haystack = `${item.title} ${item.videoUrl}`.toLowerCase();
  if (haystack.includes("tten-2")) return 0;
  if (haystack.includes("chp") && haystack.includes("dijital")) return 1;
  if (haystack.includes("tten_bj3iyd")) return 2;
  if (haystack.includes("trick_landing")) return 3;
  if (haystack.includes("otter_v4") || haystack.includes("otter")) return 4;
  if (haystack.includes("bv_main")) return 5;
  return 99;
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

    leftItems.sort((a, b) => {
      const rankDiff = portraitSortRank(a.item) - portraitSortRank(b.item);
      if (rankDiff !== 0) return rankDiff;
      return a.index - b.index;
    });

    rightItems.sort((a, b) => {
      const rankDiff = landscapeSortRank(a.item) - landscapeSortRank(b.item);
      if (rankDiff !== 0) return rankDiff;
      return a.index - b.index;
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
