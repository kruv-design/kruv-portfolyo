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
  const base = color || "#E87A00";
  return (
    <div
      className={`img-ph ${className ?? ""}`}
      style={{
        background: `${base}33`,
        fontSize,
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
