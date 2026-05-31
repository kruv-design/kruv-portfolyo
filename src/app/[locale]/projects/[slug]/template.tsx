import type { ReactNode } from "react";
import { ScrollToTopOnNavigate } from "@/components/public/ScrollToTopOnNavigate";

/** Her proje geçişinde yeni instance — scroll üstte başlar. */
export default function ProjectSlugTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ScrollToTopOnNavigate />
      {children}
    </>
  );
}
