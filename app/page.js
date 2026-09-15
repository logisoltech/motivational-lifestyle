"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { textFont } from "./Font/font";

const LEFT_CIRCLE_SRC = [1, 2, 3, 4].map((n) => `/left-circle-${n}.png`);
const RIGHT_CIRCLE_SRC = [1, 2, 3, 4].map((n) => `/right-circle-${n}.png`);

/** Order matches left-circle-1 … left-circle-4 (Cityopia → Flyer → Thinker → Government). */
const LEFT_LINKS = [
  "https://cityopia-motivational-lifestyle.vercel.app/",
  "https://flyer-motivational-lifestyle.vercel.app/",
  "https://thinker-motivational-lifestyle.vercel.app/",
  "https://government-system-motivational-life.vercel.app/",
];

/** Order matches right-circle-1 … right-circle-4 (Printer → Energy → Material → Gravity motor). */
const RIGHT_LINKS = [
  "https://product-printer-motivational-lifest.vercel.app/",
  "https://energy-motivational-lifestyle.vercel.app/",
  "https://material-motivational-lifestyle.vercel.app/",
  "https://gravity-motor-motivational-lifestyl.vercel.app/",
];

const RIGHT_LABELS = [
  "1 FOR ALL 3D PRODUCTS PRINTER/RECYCLER EQUALIZER",
  "1 DRINK-FOOD-DIET-ENERGY",
  "1 MATERIAL FOR ALL PRODUCTS (NON-EDIBLE)",
  "1 ENERGY GRAVITY MOTOR",
];

/** Order matches left-circle-1 … left-circle-4 (Cityopia → Flyer → Thinker → Government). */
const LEFT_LABELS = [
  "CITYOPIA- 1 FOR ALL FUTURE CITY",
  "1 FLYER IFFO PARK GO/LIVE/PLAY ANYWHERE",
  "1 HALO/THINKER/IMMUNIZER/PROTECTION - FOR ALL INFO & HEALTH",
  "1 GOVERNMENT FAIR SYSTEM/SOFTWARE",
];

function curveOffsetTowardCenterRem(i, maxRem) {
  const t = Math.sin((Math.PI * i) / 3);
  return maxRem * (1 - t);
}

const LEFT_CURVE_MAX_REM = 2.5;
const RIGHT_CURVE_MAX_REM = 1.9;

function SideThumb({ src, href, compact, caption, captionShiftRem = 0 }) {
  const sizeClasses = compact
    ? "h-[80px] w-[134px] sm:h-[88px] sm:w-[148px] md:h-[98px] md:w-[164px]"
    : "h-[78px] w-[140px] sm:h-[90px] sm:w-[165px] md:h-[105px] md:w-[195px]";

  const scaleClass =
    src.includes("right-circle-1") && compact
      ? "scale-110"
      : src.includes("right-circle-1")
        ? "scale-125"
        : "";

  const imageBlock = (
    <div
      className={`flex ${sizeClasses} shrink-0 items-center justify-center`}
    >
      <img
        src={src}
        alt=""
        className={`block h-full w-full object-contain object-center ${scaleClass}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  const glassLabel =
    caption != null && caption !== "" ? (
      <p
        className={`${textFont.className} whitespace-nowrap rounded-full border border-white/15 bg-black/55 px-2 py-2 text-center text-[11px] font-semibold uppercase leading-none tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_14px_rgba(0,0,0,0.35)] backdrop-blur-md sm:text-[12px] md:text-[13px]`}
        style={captionShiftRem ? { transform: `translateX(${captionShiftRem}rem)` } : undefined}
      >
        {caption}
      </p>
    ) : null;

  const column = (
    <div className="flex shrink-0 flex-col items-center gap-0">
      {imageBlock}
      {glassLabel}
    </div>
  );

  if (!href) return column;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto shrink-0 rounded-sm outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-white"
    >
      {column}
    </a>
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
    <div className="relative w-full overflow-x-hidden">
      
      {/* Background 2 — full image in normal flow so nothing is cropped */}
      <img
        src="/2.jpeg"
        alt=""
        className="block w-full h-auto select-none"
        draggable={false}
      />

      {/* Background 1 — intro overlay, pinned to viewport during the opening */}
      {!transitioned && (
        <div
          className={`fixed inset-0 z-30 overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${zoomStarted ? "animate-slow-zoom" : ""}`}
          style={{
            backgroundImage: "url('/1.png')",
            opacity: transitioned ? 0 : 1,
          }}
        />
      )}

      {/* Logo — pinned to viewport during the opening */}
      {!transitioned && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <OpeningLogo zoomStarted={zoomStarted} />
        </div>
      )}

      {/* Side Circles */}
      {transitioned && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-[15] mt-2 flex flex-col pt-[min(14vh,5rem)] pb-10 sm:pt-[min(16vh,6rem)] sm:pb-12 md:px-2 md:pt-[min(18vh,7rem)] md:pb-14">
          
          <div className="flex flex-1 justify-between px-2 sm:px-4 md:px-8">

            {/* LEFT SIDE — caption under circle, same rail + curve as right */}
            <div
              data-aos="fade-right"
              className="-mt-0 flex w-[min(92vw,22rem)] shrink-0 flex-col gap-y-3"
            >
              {LEFT_CIRCLE_SRC.map((src, i) => (
                <div
                  key={src}
                  className="flex w-full shrink-0 flex-col items-center"
                  style={{
                    transform: `translateX(${curveOffsetTowardCenterRem(i, LEFT_CURVE_MAX_REM)}rem)`,
                  }}
                >
                  <SideThumb
                    src={src}
                    href={LEFT_LINKS[i]}
                    compact
                    caption={LEFT_LABELS[i]}
                    captionShiftRem={i === 2 ? 3 : 0}
                  />
                </div>
              ))}
            </div>

            {/* RIGHT SIDE — full-width rows + centered stacks so icons track the curve evenly */}
            <div
              data-aos="fade-left"
              className="-mt-0 flex w-[min(92vw,22rem)] shrink-0 flex-col gap-y-3"
            >
              {RIGHT_CIRCLE_SRC.map((src, i) => (
                <div
                  key={src}
                  className="flex w-full shrink-0 flex-col items-center"
                  style={{
                    transform: `translateX(${-curveOffsetTowardCenterRem(i, RIGHT_CURVE_MAX_REM)}rem)`,
                  }}
                >
                  <SideThumb
                    src={src}
                    href={RIGHT_LINKS[i]}
                    compact
                    caption={RIGHT_LABELS[i]}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Top Branding */}
      {transitioned && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 select-none px-2 pt-2 pb-4 sm:px-3 sm:pt-3">
          <div
            className="grid w-full grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-4 lg:gap-8"
            data-aos="fade-down"
          >
            <aside className="text-left">
              <h2 className="text-lg font-bold uppercase">
                1 FOR ALL MOTIVATIONAL LIFESTYLE LIFE INGREDIENT & SYSTEMS
              </h2>
              <p className="max-w-3xl text-[14px] font-semibold uppercase leading-snug">
                THE FINAL PRODUCTS<span className="big-period" aria-hidden="true" /> WE SOLVED ALL OUR PROBLEMS<span className="big-period" aria-hidden="true" /> ALL PURPOSE ONE FOR ALL INGREDIENTS, PRODUCTS, CREATIONS<span className="big-period" aria-hidden="true" /> PRODUCE/RECYCLE WITH WHATEVER<br/>ALL LIFE INGREDIENTS & ELEMENTS TO LIVE SAFER, HEALTHIER, BETTER AND LONGER<span className="big-period" aria-hidden="true" /> SELF-SUFFICIENCY AND FREEDOM FOR EVERYONE<span className="big-period" aria-hidden="true" />
              </p>
            </aside>

            <div className="flex flex-col items-center text-center">
              <img
                src="/invest-.png"
                alt="Invest in self-sufficiency"
                className="mb-1 max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem]"
              />
              <p className="mb-2 max-w-[18rem] text-base font-bold uppercase leading-snug tracking-wide text-black sm:max-w-[20rem] sm:text-lg md:mb-3 md:max-w-[22rem] md:text-xl">
                & THE FUTURE FOR RESEARCH &
                <br />
                HUMANITY
                <span className="big-period" aria-hidden="true" /> PROFIT WHILE
                FUNDING
                <br />
                THE FINAL LIFESTYLE & PRODUCTS
                <span className="big-period" aria-hidden="true" />
              </p>
              {/* <p className="text-lg font-bold ">M.D. 111</p> */}
              <div className="relative mb-2 flex items-center justify-center">
                <a
                  href="#"
                  className="pointer-events-auto absolute right-full mr-2 flex h-9 w-36 items-center justify-center rounded-full bg-gradient-to-b from-[#F5D97B] via-[#E8C24A] to-[#C9962E] px-3 text-center text-sm font-bold leading-none text-black shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.03] sm:mr-3 sm:h-10 sm:w-40 sm:text-base"
                >
                  Invest / Donate
                </a>
                <img src="/md-1.png" className="max-w-[80px] shrink-0" alt="M.D. 1.1.1" />
                <a
                  href="#"
                  className="pointer-events-auto absolute left-full ml-2 flex h-9 w-36 items-center justify-center rounded-full bg-gradient-to-b from-[#F5D97B] via-[#E8C24A] to-[#C9962E] px-3 text-center text-sm font-bold leading-none text-black shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.03] sm:ml-3 sm:h-10 sm:w-40 sm:text-base"
                >
                  Buy M.D Crypto
                </a>
              </div>
              <img src="/logo.png" className="max-w-[110px]" alt="" />
            </div>

            <aside className="text-left">
              <h2 className="text-xl font-bold uppercase">
                Self sufficient Free & Easy AI Products
              </h2>
              <p className="mt-1 max-w-xl text-[14px] font-semibold uppercase leading-snug">
                NO SHOPPING, CONSTRUCTING, STORAGE
                <span className="big-period" aria-hidden="true" />
                <br />
                EQUALIZERS CREATE ANY STYLE, TASTE, FUNCTION YOU DESIRE WHEN
                YOU NEED IT<span className="big-period" aria-hidden="true" /> WE
                DO IT ALL FOR YOU
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
    const logoInTimer = setTimeout(() => setLogoVisible(true), 300);
    const logoOutTimer = setTimeout(() => setLogoVisible(false), 2500);

    return () => {
      clearTimeout(logoInTimer);
      clearTimeout(logoOutTimer);
    };
  }, []);

  return (
    <img
      src="/logo.png"
      className="transition-opacity duration-700 max-w-[140px]"
      style={{ opacity: logoVisible && !zoomStarted ? 1 : 0 }}
    />
  );
}