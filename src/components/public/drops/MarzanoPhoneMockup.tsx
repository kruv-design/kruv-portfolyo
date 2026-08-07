import { resolveDropImageSrcSet, resolveDropImageUrl } from "@/lib/drops-specimen-assets";
import { DROP_LIVE_PHOTOS, DROP_LIVE_VECTORS } from "@/lib/drops-live-assets";
import { dropFontFamily } from "@/lib/drops-font-assets";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale?: Locale;
};

const PHONE = DROP_LIVE_VECTORS.marzano.phone;

export function MarzanoPhoneMockup({ locale = "tr" }: Props) {
  void locale;
  /* Latin I — tr uppercase "Designed"→"DESİGNED" yapmasın */
  const lines = ["DESIGNED,", "BAKED,", "AND SERVED."];

  return (
    <article className="drops-live-overlay drops-live-overlay--marzano-phone" lang="en">
      <div className="drops-live-overlay__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="drops-live-overlay__bg"
          src={resolveDropImageUrl(DROP_LIVE_PHOTOS.marzano.phoneBg)}
          srcSet={resolveDropImageSrcSet(DROP_LIVE_PHOTOS.marzano.phoneBg) || undefined}
          alt="Marzano phone mockup background"
          loading="lazy"
          decoding="async"
        />
        <div className="drops-live-overlay__scrim drops-live-overlay__scrim--phone" aria-hidden />

        <div className="drops-live-phone-stage">
          <div className="drops-live-phone-device">
            <svg
              className="drops-live-phone__frame"
              viewBox="0 0 788 1416"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="2.22"
                y="2.22"
                width="783.56"
                height="1411.56"
                rx="68.78"
                stroke="var(--white-fixed)"
                strokeWidth="4.44"
              />
            </svg>

            <div className="drops-live-phone__chrome">
              <header className="drops-live-phone__header">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHONE.avatar} alt="" aria-hidden className="drops-live-phone__avatar" />
                <div className="drops-live-phone__profile">
                  <p className="drops-live-phone__brand">Tomato.to</p>
                  <p className="drops-live-phone__location">Türkiye</p>
                </div>
              </header>

              <div className="drops-live-phone__ghost" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHONE.ghostBack} alt="" className="drops-live-phone__ghost-back" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHONE.ghostFront} alt="" className="drops-live-phone__ghost-front" />
              </div>

              <div
                className="drops-live-phone__copy drops-drop-type"
                style={{ fontFamily: dropFontFamily("marzano") }}
              >
                {lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <footer className="drops-live-phone__footer">
                <p className="drops-live-phone__composer">Send Message</p>
                <div className="drops-live-phone__actions" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHONE.heart} alt="" className="drops-live-phone__icon" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHONE.send} alt="" className="drops-live-phone__icon" />
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
