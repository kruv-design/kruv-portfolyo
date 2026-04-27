export function ImagePlaceholder({
  label,
  color,
  className,
  fontSize = "2.5rem",
}: {
  label: string;
  color?: string | null;
  className?: string;
  fontSize?: string;
}) {
  const base = color || "#5D5DFF";
  return (
    <div
      className={`img-ph ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${base}33, ${base}66)`,
        fontSize,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
