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

    const exitTimer = window.setTimeout(() => setIsExiting(true), 5200);
    const doneTimer = window.setTimeout(() => setShowSplash(false), 6000);

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
      className={`splash-stage fixed inset-0 z-[100] grid place-items-center overflow-hidden transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-star-pattern splash-star-pattern-left" />
      <div className="splash-star-pattern splash-star-pattern-right" />
      <div className="splash-center-gradient" />
      <div className="splash-outline-shell">
        <Image
          src="/vgk-outline.png"
          alt=""
          width={512}
          height={512}
          priority
          className="splash-outline-image"
        />
        <div className="splash-outline-glow-window">
          <Image
            src="/vgk-outline.png"
            alt=""
            width={512}
            height={512}
            priority
            className="splash-outline-glow-image"
          />
        </div>
      </div>
    </div>
  );
}
