"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const LEFT_CIRCLE_SRC = [1, 2, 3, 4].map((n) => `/left-circle-${n}.png`);
const RIGHT_CIRCLE_SRC = [1, 2, 3, 4].map((n) => `/right-circle-${n}.png`);

/**
 * Horizontal offset toward screen center (0..1 scaled by maxRem).
 * Concave arc: top & bottom rows shift in most; middle rows stay nearer the side edge.
 * (This is the inverse of a sin bulge — visibly different from the old “middle bulges in” curve.)
 */
function curveOffsetTowardCenterRem(i, maxRem) {
  const t = Math.sin((Math.PI * i) / 3);
  return maxRem * (1 - t);
}

const LEFT_CURVE_MAX_REM = 2.5;
const RIGHT_CURVE_MAX_REM = 1.9;

/**
 * One shared box size for all 8 (viewport-aware so four rows fit without clipping).
 * img uses block + explicit dimensions so scaling is consistent across assets.
 */
function SideThumb({ src }) {
  return (
    <div className="side-thumb-box flex shrink-0 items-center justify-center">
      <img
        src={src}
        alt=""
        className="block h-full w-full object-contain object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function Home() {
  const [zoomStarted, setZoomStarted] = useState(false);
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    const logoOutMs = 2500;
    const logoFadeMs = 800;
    const pauseAfterLogoMs = 2000;
    const zoomDurationMs = 2500;

    const logoFadeEndMs = logoOutMs + logoFadeMs;
    const zoomStartMs = logoFadeEndMs + pauseAfterLogoMs;

    const zoomTimer = setTimeout(() => {
      setZoomStarted(true);
    }, zoomStartMs);

    const fadeTimer = setTimeout(() => {
      setTransitioned(true);
    }, zoomStartMs + zoomDurationMs);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    if (!transitioned) return;
    const id = requestAnimationFrame(() => {
      AOS.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [transitioned]);

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden">
      {/* Second image (underneath, revealed on fade) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/2.jpeg')" }}
      />

      {/* First image — zoom only after logo + 2s pause */}
      <div
        className={`absolute inset-0 overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${zoomStarted ? "animate-slow-zoom" : ""}`}
        style={{
          backgroundImage: "url('/1.png')",
          opacity: transitioned ? 0 : 1,
        }}
      />

      {/* Opening logo — fades in on load, fades out when zoom starts */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <OpeningLogo zoomStarted={zoomStarted} />
      </div>

      {/* Side circles — concave arc; no min-h-0 (avoids flex clipping last row) */}
      {transitioned && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-[15] flex flex-col pt-[min(22vh,9.5rem)] pb-10 sm:pt-[min(24vh,10rem)] sm:pb-12 md:px-2 md:pt-[min(26vh,11rem)] md:pb-14">
          <div className="flex flex-1 -translate-y-2 justify-between px-1 sm:-translate-y-3 sm:px-3 md:-translate-y-4 md:px-6">
            <div className="flex w-[min(50vw,13rem)] flex-col items-start justify-between gap-y-1 sm:w-[min(46vw,14rem)] md:w-[15.5rem]">
              {LEFT_CIRCLE_SRC.map((src, i) => (
                <div
                  key={src}
                  className="flex shrink-0 justify-start"
                  style={{
                    transform: `translateX(${curveOffsetTowardCenterRem(i, LEFT_CURVE_MAX_REM)}rem)`,
                  }}
                >
                  <SideThumb src={src} />
                </div>
              ))}
            </div>
            <div className="flex w-[min(50vw,13rem)] flex-col items-end justify-between gap-y-1 sm:w-[min(46vw,14rem)] md:w-[15.5rem]">
              {RIGHT_CIRCLE_SRC.map((src, i) => (
                <div
                  key={src}
                  className="flex shrink-0 justify-end"
                  style={{
                    transform: `translateX(${-curveOffsetTowardCenterRem(i, RIGHT_CURVE_MAX_REM)}rem)`,
                  }}
                >
                  <SideThumb src={src} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Branding on second image — top of page, three columns, AOS fade-down */}
      {transitioned && (
        <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-4 pb-6 sm:px-5 sm:pt-6 md:pt-8">
          <div
            className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-4 lg:gap-8"
            data-aos="fade-down"
            data-aos-duration="900"
            data-aos-easing="ease-out-cubic"
          >
            <aside className="banner-side text-left md:pr-2">
              <h2 className="banner-heading mb-2 font-sans text-[0.65rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-xs">
                One for all motivational lifestyle
              </h2>
              <p className="banner-body mb-2 font-sans text-[0.6rem] font-semibold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.65rem]">
                The final products-cooking we solved all our problems all purpose
                one for all ingredients, products, creations produce/recycle with
                whatever
              </p>
              <p className="banner-body font-sans text-[0.6rem] font-semibold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.65rem]">
                All life ingredients &amp; elements to live safer, healthier,
                better and longer self-sufficiency and freedom for everyone.
              </p>
            </aside>

            <div className="flex flex-col items-center justify-start gap-1 text-center md:mx-2 md:w-[120px] md:shrink-0">
              <p className="text-xs font-sans tracking-[0.35em] text-neutral-900 [text-shadow:0_0_2px_#fff,0_0_4px_#fff] sm:text-sm">
                M.D. 111
              </p>
              <img
                src="/logo.png"
                alt=""
                className="h-auto w-full max-w-[88px] object-contain drop-shadow-md sm:max-w-[100px] md:max-w-[112px]"
              />
            </div>

            <aside className="banner-side text-left md:pl-2">
              <h2 className="banner-heading mb-2 font-sans text-[0.65rem] font-bold uppercase leading-snug tracking-wide text-neutral-900 sm:text-xs">
                Self sufficiernt free &amp; easy A1 products
              </h2>
              <p className="banner-body mb-2 font-sans text-[0.6rem] font-semibold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.65rem]">
                No shopping, constructing, storage equalizers function, taste,
                style you desire when you need it
              </p>
              <p className="banner-body font-sans text-[0.6rem] font-semibold uppercase leading-snug tracking-wide text-neutral-900 sm:text-[0.65rem]">
                Finally the ultimate equalizer, we do it all 4 you – next step in
                human evolution
              </p>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

function OpeningLogo({ zoomStarted }) {
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const logoInMs = 300;
    const logoOutMs = 2500;
    const logoFadeMs = 800;
    const logoFadeEndMs = logoOutMs + logoFadeMs;
    const pauseAfterLogoMs = 2000;
    const zoomStartMs = logoFadeEndMs + pauseAfterLogoMs;

    const logoInTimer = setTimeout(() => {
      setLogoVisible(true);
    }, logoInMs);

    const logoOutTimer = setTimeout(() => {
      setLogoVisible(false);
    }, logoOutMs);

    return () => {
      clearTimeout(logoInTimer);
      clearTimeout(logoOutTimer);
    };
  }, []);

  return (
    <img
      src="/logo.png"
      alt=""
      className="transition-opacity duration-[800ms] ease-in-out max-w-[120px] sm:max-w-[140px]"
      style={{ opacity: logoVisible && !zoomStarted ? 1 : 0 }}
    />
  );
}
