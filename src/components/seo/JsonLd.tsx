import type { JsonLdNode } from "@/lib/seo/structured-data";
import { toJsonLdDocument, toJsonLdGraph } from "@/lib/seo/structured-data";

type JsonLdProps = {
  data: JsonLdNode | JsonLdNode[];
};

/** Renders Schema.org JSON-LD in a single `<script type="application/ld+json">`. */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? toJsonLdGraph(data) : toJsonLdDocument(data);

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
