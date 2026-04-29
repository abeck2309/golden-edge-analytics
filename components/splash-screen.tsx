"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const hasPlayed = sessionStorage.getItem("golden-edge-splash-played");

    if (hasPlayed) {
      return;
    }

    sessionStorage.setItem("golden-edge-splash-played", "true");
    setShowSplash(true);

    const exitTimer = window.setTimeout(() => setIsExiting(true), 1850);
    const doneTimer = window.setTimeout(() => setShowSplash(false), 2350);

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
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#050607] transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-grid" />
      <div className="splash-sweep" />
      <div className="splash-glow" />

      <div className="relative flex flex-col items-center">
        <div className="splash-logo-shell">
          <Image
            src="/pwa-icon-192.png"
            alt=""
            width={132}
            height={132}
            priority
            className="h-28 w-28 rounded-[26px] object-cover shadow-[0_0_55px_rgba(216,188,122,0.35)] sm:h-32 sm:w-32"
          />
        </div>

        <div className="mt-6 overflow-hidden">
          <p className="splash-title font-[family-name:var(--font-heading)] text-xl font-black uppercase tracking-[0.24em] text-gold-bright sm:text-2xl">
            Golden Edge
          </p>
        </div>
        <div className="mt-2 overflow-hidden">
          <p className="splash-subtitle text-xs font-bold uppercase tracking-[0.42em] text-frost/80">
            Analytics
          </p>
        </div>

        <div className="mt-7 h-px w-52 overflow-hidden rounded-full bg-white/10">
          <div className="splash-loader h-full rounded-full bg-gold-bright" />
        </div>
      </div>
    </div>
  );
}
