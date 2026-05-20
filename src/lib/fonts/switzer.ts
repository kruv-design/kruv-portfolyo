import localFont from "next/font/local";

/** Site geneli display/body — `public/fonts/switzer` (kruv-website/Switzer paketi). */
export const switzer = localFont({
  src: [
    {
      path: "../../../public/fonts/switzer/Switzer-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../public/fonts/switzer/Switzer-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/** Olly landing — aynı Switzer dosyaları, ayrı CSS değişkeni. */
export const switzerOlly = localFont({
  src: [
    {
      path: "../../../public/fonts/switzer/Switzer-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../public/fonts/switzer/Switzer-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-olly-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
