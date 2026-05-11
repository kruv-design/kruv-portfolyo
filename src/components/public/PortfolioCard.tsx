import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Homepage `featured-work-*` kartları ile aynı yapı: görsel üstte, meta altta (hover overlay yok).
 */
export function PortfolioCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const desc = (project.aciklama || "").trim();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="pw-card group animate-fadeUp"
      style={{ animationDelay: `${index * 0.055}s` }}
      aria-label={project.baslik}
    >
      <div className="pw-card-media">
        {project.gorsel ? (
          <Image
            src={project.gorsel}
            alt={project.baslik}
            fill
            sizes="(max-width: 699px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-[1800ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
            placeholder="empty"
            priority={index < 2}
          />
        ) : (
          <ImagePlaceholder
            label={String(index + 1).padStart(2, "0")}
            color={project.renk}
            className="h-full min-h-0 w-full"
          />
        )}
      </div>
      <div className="pw-card-meta">
        <h2 className="pw-card-title">{project.baslik}</h2>
        {desc ? <p className="pw-card-desc">{desc}</p> : null}
        <p className="pw-card-category">{project.kategori}</p>
      </div>
    </Link>
  );
}
