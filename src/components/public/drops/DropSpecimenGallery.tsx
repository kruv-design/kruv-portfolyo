import type { DropSpecimenBlock } from "@/types";
import { publicCldImageUrl } from "@/lib/cld-public";

const ALPHABET_TR =
  "A B C Ç D E F G Ğ H ı İ J K L M N O Ö P R S Ş T U Ü V Y Z";
const NUMBERS = "1234567890 ?!&/";

type Props = {
  blocks: DropSpecimenBlock[];
};

function renderBlock(block: DropSpecimenBlock, key: string) {
  if (block.type === "text") {
    return (
      <p
        key={key}
        className={`drops-specimen__text${block.style ? ` drops-specimen__text--${block.style}` : ""}`}
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "alphabet") {
    return (
      <div key={key} className="drops-specimen__alphabet">
        <p>{ALPHABET_TR}</p>
        {block.includeNumbers ? <p>{NUMBERS}</p> : null}
      </div>
    );
  }
  if (block.type === "image") {
    const src = block.gorsel.startsWith("http")
      ? block.gorsel
      : publicCldImageUrl(block.gorsel, { w: 1400, crop: "fit" });
    if (!src) return null;
    return (
      <figure key={key} className="drops-specimen__figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={block.alt ?? ""} loading="lazy" />
      </figure>
    );
  }
  if (block.type === "split") {
    return (
      <div key={key} className="drops-specimen__split">
        <div>{renderBlock(block.left as DropSpecimenBlock, `${key}-l`)}</div>
        <div>{renderBlock(block.right as DropSpecimenBlock, `${key}-r`)}</div>
      </div>
    );
  }
  return null;
}

export function DropSpecimenGallery({ blocks }: Props) {
  if (!blocks.length) return null;
  return (
    <section className="drops-specimen" aria-label="Specimen">
      {blocks.map((block, i) => renderBlock(block, `block-${i}`))}
    </section>
  );
}
