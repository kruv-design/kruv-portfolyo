"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollToTopOnNavigate } from "./ScrollToTopOnNavigate";

/** Slug değişince içerik yeniden mount + scroll üstte (paylaşılan layout scroll’u korur). */
export function ProjectSlugTemplateClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <ScrollToTopOnNavigate />
      <div key={pathname}>{children}</div>
    </>
  );
}
