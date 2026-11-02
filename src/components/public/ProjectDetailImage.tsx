import Image from "next/image";

type ProjectDetailImageVariant = "cover" | "gallery";

/** Proje detay: sabit çerçeve (16:9), object-fit cover. */
export function ProjectDetailImage({
  src,
  alt,
  priority = false,
  variant = "gallery",
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: ProjectDetailImageVariant;
  sizes?: string;
}) {
  const resolvedSizes =
    sizes ??
    (variant === "cover" ? "100vw" : "(max-width: 768px) 95vw, 80vw");
  const className =
    variant === "cover" ? "project-detail-cover-img" : "project-detail-media-img";

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
