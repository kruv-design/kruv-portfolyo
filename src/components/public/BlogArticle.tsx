import { KruvStarIcon } from "@/components/public/KruvStarIcon";
import type { BlogPost } from "@/types";

function Paragraphs({ text, className }: { text: string; className?: string }) {
  const parts = text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className={["b1", className].filter(Boolean).join(" ")}>
          {p}
        </p>
      ))}
    </>
  );
}

/**
 * Blog detay — Figma "Blog detay" (4225:3622): dar orta kolon,
 * yıldız + H1 + giriş, ardından bölümler (H2 + metin + opsiyonel görsel).
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
        <h1 className="h1 blog-article__title">{post.baslik}</h1>
        {dateLabel ? (
          <p className="b2 blog-article__date">{dateLabel}</p>
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
            <h2 className="h2 blog-article__heading">{section.baslik}</h2>
          ) : null}
          {section.metin ? (
            <div className="blog-article__text">
              <Paragraphs text={section.metin} />
            </div>
          ) : null}
          {section.gorsel ? (
            <figure className="blog-article__figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.gorsel}
                alt={section.baslik || post.baslik}
                className="blog-article__image"
                loading={i < 1 ? "eager" : "lazy"}
              />
              {section.gorselNot ? (
                <figcaption className="b2 blog-article__caption">
                  {section.gorselNot}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </section>
      ))}
    </article>
  );
}
