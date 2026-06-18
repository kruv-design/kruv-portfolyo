const STAR_PATH =
  "M52 25.0492 30.8658 21.1423 26.9536 0H25.0464L21.1399 21.1365 0 25.0492v1.9074L21.1342 30.8635 25.0407 52h1.9071L30.8543 30.8635 51.9885 26.9566V25.0492H52Z";

/** Site geneli 4 uçlu yıldız — renk `currentColor` ile gelir (gradient yok). */
export function KruvStarIcon({
  className,
  size = 52,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 52 52"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d={STAR_PATH} />
    </svg>
  );
}
