import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function PortfolioCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const tags = (project.etiketler || []).slice(0, 3);
  const featuredCls = project.featured ? "featured" : "";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`portfolio-item group relative block overflow-hidden animate-fadeUp ${featuredCls}`}
      style={{
        aspectRatio: project.featured ? "16 / 7" : "4 / 3",
        gridColumn: project.featured ? "span 2" : undefined,
        background: "var(--surface)",
        animationDelay: `${index * 0.055}s`,
      }}
      aria-label={project.baslik}
    >
      {project.gorsel ? (
        <Image
          src={project.gorsel}
          alt={project.baslik}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[550ms] ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]"
          placeholder="empty"
          priority={index < 2}
        />
      ) : (
        <ImagePlaceholder label={String(index + 1).padStart(2, "0")} color={project.renk} />
      )}

      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to top, var(--gray-scrim-800) 0%, transparent 55%)",
        }}
      >
        <div
          className="b3 mb-2"
          style={{ color: "var(--accent)", letterSpacing: "0.18em" }}
        >
          {project.kategori}
        </div>
        <div
          className="h3 mb-2"
          style={{ color: "var(--gray-1000)", letterSpacing: "0.02em" }}
        >
          {project.baslik}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 py-0.5 b3 normal-case"
                style={{
                  borderColor: "var(--gray-300)",
                  color: "var(--gray-700)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
