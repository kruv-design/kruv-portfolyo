/** Above-the-fold — `kruv.css` async yüklenirken FOUC/CLS önleme. */
export const MARKETING_CRITICAL_CSS = `
.marketing-page-shell { background: var(--midnight); color: var(--frost); min-height: 100vh; }
.marketing-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
#nav-sentinel, .marketing-nav-sentinel { height: 1px; width: 100%; margin: 0; padding: 0; }
.hero-v2 { background: var(--midnight); min-height: 100svh; display: flex; align-items: center; justify-content: center; }
.hero-v2-headline { opacity: 1; margin: 0; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.12em; }
.hero-v2-accent { font: italic 400 clamp(1.625rem, 7.7vw, 5.5rem)/1.1 var(--font-display), system-ui, sans-serif; color: var(--color-accent); text-align: center; width: 100%; }
.hero-v2-main { font: 500 clamp(1.625rem, 7.7vw, 5.5rem)/1.1 var(--font-display), system-ui, sans-serif; color: var(--frost); text-align: center; width: 100%; }
.home-showreel { box-sizing: border-box; width: 100vw; max-width: 100vw; margin-left: calc(50% - 50vw); padding: 0; overflow: hidden; }
.home-showreel__variant--web { display: none; }
.home-showreel__variant--mobile { display: block; }
.home-showreel__variant--solo { display: block; }
.home-showreel__variant--web .project-detail-media,
.home-showreel__variant--solo .project-detail-media { position: relative; aspect-ratio: 16 / 9; width: 100%; overflow: hidden; background: var(--surface); }
.home-showreel__variant--mobile .project-detail-media { position: relative; width: 100%; aspect-ratio: 9 / 16; max-height: min(92vh, 52rem); height: auto; overflow: hidden; background: var(--surface); }
@media (min-width: 900px) {
  .home-showreel__variant--web { display: block; }
  .home-showreel__variant--mobile { display: none; }
}
`.trim();
