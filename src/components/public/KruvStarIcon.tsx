/** Site geneli 4 uçlu yıldız — kayan yazı, section tag, ayırıcılar. */
export function KruvStarIcon({
  className,
  size = 52,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/assets/kruv-star.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
      decoding="async"
    />
  );
}
