import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import type { BlogPost } from "@/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** Blog liste kartı — Figma: kapak (rounded 12) + 32px başlık. */
export function BlogCard({
  post,
  index,
  locale,
}: {
  post: BlogPost;
  index: number;
  locale: Locale;
}) {
  return (
    <Link
      href={withLocale(`/blog/${post.slug}`, locale)}
      className="blog-card"
      aria-label={post.baslik}
    >
      <div className="blog-card__media">
        {post.kapak ? (
          <Image
            src={post.kapak}
            alt={post.baslik}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 899px) 50vw, 33vw"
            className="blog-card__img"
            priority={index < 3}
          />
        ) : (
          <ImagePlaceholder
            label={String(index + 1).padStart(2, "0")}
            className="blog-card__placeholder"
          />
        )}
      </div>
      <h2 className="blog-card__title">{post.baslik}</h2>
    </Link>
  );
}
