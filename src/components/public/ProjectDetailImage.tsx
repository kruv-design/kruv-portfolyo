import Image from "next/image";

type ProjectDetailImageVariant = "cover" | "gallery";
type ProjectDetailImageFit = "frame" | "natural";

/** Proje detay: varsayılan sabit çerçeve (16:9) cover; natural = Figma oranı, croplama yok. */
export function ProjectDetailImage({
  src,
  alt,
  priority = false,
  variant = "gallery",
  fit = "frame",
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: ProjectDetailImageVariant;
  fit?: ProjectDetailImageFit;
  sizes?: string;
}) {
  const resolvedSizes =
    sizes ??
    (variant === "cover" ? "100vw" : "(max-width: 768px) 95vw, 80vw");
  const className =
    variant === "cover" ? "project-detail-cover-img" : "project-detail-media-img";

  if (fit === "natural") {
    return (
      <Image
        src={src}
        alt={alt}
        width={3840}
        height={2160}
        sizes={resolvedSizes}
        priority={priority}
        className={className}
        style={{ width: "100%", height: "auto" }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={resolvedSizes}
      priority={priority}
      className={className}
    />
  );
}
