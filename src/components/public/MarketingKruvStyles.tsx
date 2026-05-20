/** Ana site (`kruv.html`) ile aynı stil dosyası + LCP critical hero kuralları. */
export function MarketingKruvStyles() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/switzer/Switzer-Variable.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/fonts/switzer/switzer.css" />
      <style id="critical-lcp">{`
  .hero-v2 { background: #0e0e0e; min-height: 100svh; display: flex; align-items: center; justify-content: center; }
  .hero-v2-headline { opacity: 1; margin: 0; }
  .hero-v2-line1 { display: inline-flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 0.28em; }
  .hero-v2-word-box { width: fit-content; max-width: 100%; }
  .hero-v2-static, .hero-v2-word { font: 500 clamp(1.625rem, 7.7vw, 5.5rem)/1.1 Switzer, system-ui, sans-serif; color: #fafafa; }
  .hero-v2-suffix { font: italic 400 clamp(1.625rem, 7.7vw, 5.5rem)/1.1 Switzer, system-ui, sans-serif; color: #6366f1; }
`}</style>
      <link rel="preload" href="/kruv.css" as="style" />
      <link rel="stylesheet" href="/kruv.css" />
    </>
  );
}
