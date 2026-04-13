"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    // Fade in the logo shortly after load
    const logoInTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    // Blur kicks in right when the zoom starts (2s delay)
    const blurTimer = setTimeout(() => {
      setZooming(true);
    }, 2000);

    // Logo fades out after 3s
    const logoOutTimer = setTimeout(() => {
      setLogoVisible(false);
    }, 2500);

    const fadeTimer = setTimeout(() => {
      setTransitioned(true);
    }, 4500);

    return () => {
      clearTimeout(logoInTimer);
      clearTimeout(blurTimer);
      clearTimeout(logoOutTimer);
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

      {/* First image with zoom animation, fades out */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom transition-opacity duration-[2000ms] ease-in-out"
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

      {/* Edge blur / vignette overlay — fades in with zoom, fades out with transition */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[1000ms] ease-in-out"
        style={{
          boxShadow: "inset 0 0 150px 60px rgba(0, 0, 0, 0.6)",
          mask: "radial-gradient(ellipse 50% 50% at center, transparent 30%, black 100%)",
          WebkitMask:
            "radial-gradient(ellipse 50% 50% at center, transparent 30%, black 100%)",
          backdropFilter: "blur(6px)",
          opacity: transitioned ? 0 : zooming ? 1 : 0,
        }}
      />
    </div>
  );
}
