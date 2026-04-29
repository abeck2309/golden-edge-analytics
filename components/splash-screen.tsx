"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowSplash(false);
      return;
    }

    const hasPlayed = sessionStorage.getItem("golden-edge-splash-played");

    if (hasPlayed) {
      setShowSplash(false);
      return;
    }

    sessionStorage.setItem("golden-edge-splash-played", "true");

    const exitTimer = window.setTimeout(() => setIsExiting(true), 2100);
    const doneTimer = window.setTimeout(() => setShowSplash(false), 2650);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!showSplash) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#050607] transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-ambient" />
      <div className="splash-ribbon splash-ribbon-one" />
      <div className="splash-ribbon splash-ribbon-two" />
      <div className="splash-ribbon splash-ribbon-three" />
      <div className="splash-particles splash-particles-one" />
      <div className="splash-particles splash-particles-two" />

      <div className="splash-logo-shell">
        <Image
          src="/icon.png"
          alt=""
          width={512}
          height={512}
          priority
          className="h-52 w-52 object-contain sm:h-72 sm:w-72"
        />
      </div>
    </div>
  );
}
