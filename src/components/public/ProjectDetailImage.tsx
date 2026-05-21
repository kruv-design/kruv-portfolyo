import Image from "next/image";

/** Proje detay: orijinal en-boy; zorunlu kırpma / sabit çerçeve yok. */
export function ProjectDetailImage({
  src,
  alt,
  priority = false,
  sizes = "80vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={sizes}
      priority={priority}
      className="project-detail-media-img"
    />
  );
}
