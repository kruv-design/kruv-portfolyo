/** Anasayfa ticker + audience kartları — ortak illüstrasyon seti */
export const HOME_ILLUSTRATION_SVGS = [
  "/assets/ticker-hands/hand-brand.svg",
  "/assets/ticker-hands/buyutec.svg",
  "/assets/ticker-hands/social.svg",
] as const;

export function homeIllustrationSrc(index: number): string {
  return HOME_ILLUSTRATION_SVGS[index % HOME_ILLUSTRATION_SVGS.length]!;
}
