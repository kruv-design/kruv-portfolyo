import type { ReactNode } from "react";
import { resolveDropImageSrcSet, resolveDropImageUrl } from "@/lib/drops-specimen-assets";

type Props = {
  photoId: string;
  alt?: string;
  className?: string;
  scrim?: "light" | "dark" | "none";
  tint?: string;
  beforeContent?: ReactNode;
  children?: ReactNode;
};

export function DropSpecimenOverlay({
  photoId,
  alt = "",
  className,
  scrim = "none",
  tint,
  beforeContent,
  children,
}: Props) {
  const rootClass = ["drops-live-overlay", className].filter(Boolean).join(" ");

  return (
    <article className={rootClass}>
      <div className="drops-live-overlay__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="drops-live-overlay__bg"
          src={resolveDropImageUrl(photoId)}
          srcSet={resolveDropImageSrcSet(photoId) || undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
        {tint ? (
          <div className="drops-live-overlay__tint" style={{ background: tint }} aria-hidden />
        ) : null}
        {scrim !== "none" ? (
          <div
            className={`drops-live-overlay__scrim drops-live-overlay__scrim--${scrim}`}
            aria-hidden
          />
        ) : null}
        {beforeContent}
        {children ? <div className="drops-live-overlay__content">{children}</div> : null}
      </div>
    </article>
  );
}
