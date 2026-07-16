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

type BentoRow = {
  left?: ColumnEntry;
  right?: ColumnEntry;
};

function pickLandscape(
  landscapes: ColumnEntry[],
  used: Set<number>,
  preferLeft: boolean,
): ColumnEntry | undefined {
  const preferred = landscapes.find(
    (entry) =>
      !used.has(entry.index) &&
      isLeftColumnVideo(entry.item) === preferLeft,
  );
  if (preferred) {
    return preferred;
  }

  return landscapes.find((entry) => !used.has(entry.index));
}

function buildBentoRows(items: ProtelSampleVideo[]): BentoRow[] {
  const indexed = items.map((item, index) => ({ item, index }));
  const portraits = indexed
    .filter(({ item }) => isPortraitVideo(item))
    .sort((a, b) => a.index - b.index);
  const landscapes = indexed
    .filter(({ item }) => !isPortraitVideo(item))
    .sort((a, b) => a.index - b.index);

  const usedLandscapes = new Set<number>();
  const rows: BentoRow[] = [];

  for (const portrait of portraits) {
    const portraitOnLeft = isLeftColumnVideo(portrait.item);
    const landscape = pickLandscape(
      landscapes,
      usedLandscapes,
      !portraitOnLeft,
    );

    if (landscape) {
      usedLandscapes.add(landscape.index);
    }

    rows.push(
      portraitOnLeft
        ? { left: portrait, right: landscape }
        : { left: landscape, right: portrait },
    );
  }

  for (const landscape of landscapes) {
    if (usedLandscapes.has(landscape.index)) {
      continue;
    }

    rows.push(
      isLeftColumnVideo(landscape.item)
        ? { left: landscape }
        : { right: landscape },
    );
  }

  return rows;
}

function BentoCell({ entry }: { entry?: ColumnEntry }) {
  if (!entry) {
    return <div className="protel-bento__cell protel-bento__cell--empty" aria-hidden="true" />;
  }

  return (
    <div className="protel-bento__cell">
      <ProtelBentoVideo item={entry.item} />
    </div>
  );
}

export function ProtelSampleBentoClient({ items }: { items: ProtelSampleVideo[] }) {
  const rows = useMemo(() => buildBentoRows(items), [items]);

  return (
    <div className="protel-bento">
      {rows.map((row, rowIndex) => {
        const rowKey = [
          row.left ? `${row.left.index}-${row.left.item.videoUrl}` : "empty-left",
          row.right ? `${row.right.index}-${row.right.item.videoUrl}` : "empty-right",
        ].join("|");

        return (
          <div key={`row-${rowIndex}-${rowKey}`} className="protel-bento__row">
            <BentoCell entry={row.left} />
            <BentoCell entry={row.right} />
          </div>
        );
      })}
    </div>
  );
}
