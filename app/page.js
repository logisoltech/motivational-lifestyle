"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [zoomStarted, setZoomStarted] = useState(false);
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    const logoInMs = 300;
    const logoOutMs = 2500;
    const logoFadeMs = 800;
    const pauseAfterLogoMs = 2000;
    const zoomDurationMs = 2500;

    const logoFadeEndMs = logoOutMs + logoFadeMs;
    const zoomStartMs = logoFadeEndMs + pauseAfterLogoMs;

    const logoInTimer = setTimeout(() => {
      setLogoVisible(true);
    }, logoInMs);

    const logoOutTimer = setTimeout(() => {
      setLogoVisible(false);
    }, logoOutMs);

    const zoomTimer = setTimeout(() => {
      setZoomStarted(true);
    }, zoomStartMs);

    const fadeTimer = setTimeout(() => {
      setTransitioned(true);
    }, zoomStartMs + zoomDurationMs);

    return () => {
      clearTimeout(logoInTimer);
      clearTimeout(logoOutTimer);
      clearTimeout(zoomTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Second image (underneath, revealed on fade) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/2.jpeg')" }}
      />

      {/* First image — zoom only after logo + 2s pause */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${zoomStarted ? "animate-slow-zoom" : ""}`}
        style={{
          backgroundImage: "url('/1.png')",
          opacity: transitioned ? 0 : 1,
        }}
      />

      {/* Logo — fades in on load, fades out when zoom starts */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="transition-opacity duration-[800ms] ease-in-out max-w-[300px]"
          style={{ opacity: logoVisible ? 1 : 0 }}
        />
      </div>

    </div>
  );
}
