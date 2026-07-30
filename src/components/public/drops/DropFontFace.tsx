"use client";

import { useEffect } from "react";
import { publicCldRawUrl } from "@/lib/cld-public";
import { dropFontFamily, dropFontFormat } from "@/lib/drops-font-assets";

type Props = {
  slug: string;
  previewUrl: string;
};

/** Drop fontunu @font-face ile yükler — her kart/sayfa kendi font-family değerini kullanır. */
export function DropFontFace({ slug, previewUrl }: Props) {
  useEffect(() => {
    const url = previewUrl.startsWith("http")
      ? previewUrl
      : previewUrl
        ? publicCldRawUrl(previewUrl)
        : "";
    const styleId = `drop-font-face-${slug}`;
    if (!url) {
      document.getElementById(styleId)?.remove();
      document.getElementById(`drop-font-preload-${slug}`)?.remove();
      return;
    }

    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    const family = dropFontFamily(slug).slice(1, -1);
    const { cssFormat, mimeType } = dropFontFormat(url);
    style.textContent = `
      @font-face {
        font-family: "${family}";
        src: url("${url}") format("${cssFormat}");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    const preloadId = `drop-font-preload-${slug}`;
    let link = document.getElementById(preloadId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = preloadId;
      link.rel = "preload";
      link.as = "font";
      link.type = mimeType;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
    link.href = url;

    return () => {
      style?.remove();
      link?.remove();
    };
  }, [slug, previewUrl]);

  return null;
}
