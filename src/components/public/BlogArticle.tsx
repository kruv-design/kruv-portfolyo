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
        <p key={i} className={className}>
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
export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article className="blog-article">
      <KruvStarIcon className="blog-article__star" size={38} />
      <h1 className="blog-article__title">{post.baslik}</h1>
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
          {section.gorsel ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={section.gorsel}
              alt={section.baslik || post.baslik}
              className="blog-article__image"
              loading={i < 1 ? "eager" : "lazy"}
            />
          ) : null}
        </section>
      ))}
    </article>
  );
}
