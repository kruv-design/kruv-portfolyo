import { KruvStarIcon } from "@/components/public/KruvStarIcon";
import type { BlogPost, BlogSection } from "@/types";

function Paragraphs({ text, className }: { text: string; className?: string }) {
  const parts = text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className={className || undefined}>
          {p}
        </p>
      ))}
    </>
  );
}

function SectionGallery({
  section,
  postTitle,
  eager,
}: {
  section: BlogSection;
  postTitle: string;
  eager: boolean;
}) {
  const gallery = section.gorseller?.filter((img) => img.src.trim()) ?? [];
  if (gallery.length > 0) {
    return (
      <div className="blog-article__gallery" role="group">
        {gallery.map((img, j) => (
          <figure key={`${img.src}-${j}`} className="blog-article__gallery-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.caption || section.baslik || postTitle}
              className="blog-article__gallery-image"
              loading={eager && j < 3 ? "eager" : "lazy"}
            />
            {img.caption ? (
              <figcaption className="blog-article__gallery-caption">
                {img.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    );
  }

  if (!section.gorsel) return null;

  return (
    <figure className="blog-article__figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={section.gorsel}
        alt={section.baslik || postTitle}
        className="blog-article__image"
        loading={eager ? "eager" : "lazy"}
      />
      {section.gorselNot ? (
        <figcaption className="blog-article__caption">
          {section.gorselNot}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Blog detay — Figma "Blog detay" (4225:3622 / 5932:1627): dar orta kolon,
 * yıldız + H1 + giriş, ardından bölümler (H2 + metin + opsiyonel görsel / 3’lü grid).
 */
export function BlogArticle({
  post,
  dateLabel,
}: {
  post: BlogPost;
  dateLabel?: string;
}) {
  return (
    <article className="blog-article">
      <KruvStarIcon className="blog-article__star" size={38} />
      <header className="blog-article__header">
        <h1 className="blog-article__title">{post.baslik}</h1>
        {dateLabel ? (
          <p className="blog-article__meta">
            <span className="blog-article__date">{dateLabel}</span>
          </p>
        ) : null}
      </header>
      {post.aciklama ? (
        <div className="blog-article__intro">
          <Paragraphs text={post.aciklama} />
        </div>
      ) : null}
      {post.bolumler.map((section, i) => (
        <section key={i} className="blog-article__section">
          {section.baslik ? (
            <h2 className="blog-article__heading">{section.baslik}</h2>
          ) : null}
          {section.metin ? (
            <div className="blog-article__text">
              <Paragraphs text={section.metin} />
            </div>
          ) : null}
          <SectionGallery
            section={section}
            postTitle={post.baslik}
            eager={i < 1}
          />
        </section>
      ))}
    </article>
  );
}
