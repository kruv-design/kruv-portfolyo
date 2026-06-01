import type { ReactNode } from "react";
import { ProjectSlugTemplateClient } from "@/components/public/ProjectSlugTemplateClient";

export default function ProjectSlugTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <ProjectSlugTemplateClient>{children}</ProjectSlugTemplateClient>;
}
