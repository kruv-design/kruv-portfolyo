import Link from "next/link";
import type { ComponentProps } from "react";
import { isExternalCtaHref } from "@/lib/contact-cta";

type ProjectCtaLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Projeye başla — dahili /contact veya harici WhatsApp. */
export function ProjectCtaLink({
  href,
  className,
  children,
  onClick,
  tabIndex,
  ...rest
}: ProjectCtaLinkProps) {
  if (isExternalCtaHref(href)) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      {...rest}
    >
      {children}
    </Link>
  );
}
