import type { ReactNode } from "react";

export function ProtelSectionHeading({
  label,
  aside,
}: {
  label: string;
  aside?: ReactNode;
}) {
  return (
    <div className="protel-section-heading">
      <div className="protel-section-heading__main">
        <img
          src="/assets/protel-plus.svg"
          alt=""
          aria-hidden="true"
          className="protel-section-heading__icon"
          width={24}
          height={24}
        />
        <p className="protel-section-heading__label">{label}</p>
      </div>
      {aside ? <div className="protel-section-heading__aside">{aside}</div> : null}
    </div>
  );
}
