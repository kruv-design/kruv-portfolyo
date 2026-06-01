"use client";

/** Render-blocking olmadan stil yükle (critical CSS ayrı inline). */
export function AsyncStylesheet({ href }: { href: string }) {
  return (
    <>
      <link rel="preload" href={href} as="style" />
      <link
        rel="stylesheet"
        href={href}
        media="print"
        onLoad={(e) => {
          (e.currentTarget as HTMLLinkElement).media = "all";
        }}
      />
      <noscript>
        <link rel="stylesheet" href={href} />
      </noscript>
    </>
  );
}
