"use client";

import type { ReactNode } from "react";
import { ScrollToTopOnNavigate } from "./ScrollToTopOnNavigate";

/** template.tsx — scroll üstte (asıl mount: ProjectDetailPageFrame slug key). */
export function ProjectSlugTemplateClient({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTopOnNavigate />
      {children}
    </>
  );
}
