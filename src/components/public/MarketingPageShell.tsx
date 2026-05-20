import type { CSSProperties, ReactNode } from "react";
import { MarketingKruvStyles } from "./MarketingKruvStyles";

/** Works / Contact — nav + ortak hero + içerik; `kruv.css` tek kaynak. */
export function MarketingPageShell({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={["marketing-page-shell", className].filter(Boolean).join(" ")}
      style={style}
    >
      <MarketingKruvStyles />
      {children}
    </div>
  );
}
