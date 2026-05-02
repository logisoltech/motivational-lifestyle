"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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

function curveOffsetTowardCenterRem(i, maxRem) {
  const t = Math.sin((Math.PI * i) / 3);
  return maxRem * (1 - t);
}

const LEFT_CURVE_MAX_REM = 2.5;
const RIGHT_CURVE_MAX_REM = 1.9;

function SideThumb({ src, href }) {
  const inner = (
    <div className="flex h-[78px] w-[140px] shrink-0 items-center justify-center sm:h-[90px] sm:w-[165px] md:h-[105px] md:w-[195px]">
      <img
        src={src}
        alt=""
        className={`block h-full w-full object-contain object-center ${
          src.includes("right-circle-1") ? "scale-125" : ""
        }`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  if (!href) return inner;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto shrink-0 rounded-sm outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-white"
    >
      {inner}
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
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden">
      
      {/* Background 2 — position between top (0%) and center (50%) on the Y axis */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/2.jpeg')",
          backgroundPosition: "center 30%",
        }}
      />

      {/* Background 1 */}
      <div
        className={`absolute inset-0 overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${zoomStarted ? "animate-slow-zoom" : ""}`}
        style={{
          backgroundImage: "url('/banner-1.png')",
          opacity: transitioned ? 0 : 1,
        }}
      />

      {/* Logo */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <OpeningLogo zoomStarted={zoomStarted} />
      </div>

      {/* Side Circles */}
      {transitioned && (
        <div  className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-[15] flex flex-col pt-[min(20vh,7rem)] pb-10 sm:pt-[min(22vh,8rem)] sm:pb-12 md:px-2 md:pt-[min(25vh,9rem)] md:pb-14">
          
          <div className="flex flex-1 justify-between px-2 sm:px-4 md:px-8">

            {/* LEFT SIDE */}
            <div data-aos="fade-right" className="-mt-0 flex w-[min(50vw,16rem)] flex-col items-start gap-y-2">
              {LEFT_CIRCLE_SRC.map((src, i) => (
                <div
                  key={src}
                  className="flex shrink-0 justify-start"
                  style={{
                    transform: `translateX(${curveOffsetTowardCenterRem(i, LEFT_CURVE_MAX_REM)}rem)`,
                  }}
                >
                  <SideThumb src={src} href={LEFT_LINKS[i]} />
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div data-aos="fade-left" className="-mt-0 flex w-[min(50vw,16rem)] flex-col items-end gap-y-2">
              {RIGHT_CIRCLE_SRC.map((src, i) => (
                <div
                  key={src}
                  className="flex shrink-0 justify-end"
                  style={{
                    transform: `translateX(${-curveOffsetTowardCenterRem(i, RIGHT_CURVE_MAX_REM)}rem)`,
                  }}
                >
                  <SideThumb src={src} href={RIGHT_LINKS[i]} />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Top Branding */}
      {transitioned && (
        <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-4 pb-6 sm:px-5 sm:pt-6 md:pt-8">
          <div
            className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-4 lg:gap-8"
            data-aos="fade-down"
          >
            <aside className="text-left ml-12">
              <h2 className="text-xl font-bold uppercase">
                One for all motivational lifestyle
              </h2>
              <p className="text-[11px] mt-3 max-w-md font-semibold uppercase">
                THE FINAL PRODUCTS-COOKING WE SOLVED ALL OUR PROBLEMS ALL PURPOSE ONE FOR ALL INGREDIENTS, PRODUCTS, CREATIONS PRODUCE/RECYCLE WITH WHATEVER<br/>ALL LIFE INGREDIENTS & ELEMENTS TO LIVE SAFER, HEALTHIER, BETTER AND LONGERSELF-SUFFICIENCY AND FREEDOM FOR EVERYONE.
              </p>
            </aside>

            <div className="flex flex-col items-center">
              <p className="text-lg font-bold ">M.D. 111</p>
              <img src="/logo.png" className="max-w-[110px]" />
            </div>

            <aside className="text-left ml-12">
              <h2 className="text-xl font-bold uppercase">
                Self sufficient Free & Easy AI Products
              </h2>
              <p className="text-[11px] mt-3 max-w-md font-semibold uppercase">
                NO SHOPPING, CONSTRUCTING, STORAGE EQUALIZERS FUNCTION, TASTE, STYLE YOU DESIRE WHEN YOU NEED IT
                <br/>
                <span className="mt-4">FINALLY THE ULTIMATE EQUALIZER. WE DO IT ALL FOR YOU – NEXT STEP IN HUMAN EVOLUTION</span>
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