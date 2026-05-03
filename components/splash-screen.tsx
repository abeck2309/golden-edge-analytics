"use client";

import { useEffect, useState } from "react";

const RED_TRACE_START_MS = 6050;
const SPLASH_SOUND_STORAGE_KEY = "golden-edge-splash-sound-enabled";

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

    const splashSoundEnabled = localStorage.getItem(SPLASH_SOUND_STORAGE_KEY) === "true";
    const redTraceAudio = splashSoundEnabled ? new Audio("/splash-red-trace.wav") : null;

    if (redTraceAudio) {
      redTraceAudio.preload = "auto";
      redTraceAudio.volume = 0.72;
    }

    const audioTimer = redTraceAudio
      ? window.setTimeout(() => {
          redTraceAudio.currentTime = 0;
          redTraceAudio.play().catch(() => {
            // Mobile browsers may still block splash audio until the user interacts during this launch.
          });
        }, RED_TRACE_START_MS)
      : null;
    const exitTimer = window.setTimeout(() => setIsExiting(true), 7600);
    const doneTimer = window.setTimeout(() => setShowSplash(false), 8300);

    return () => {
      redTraceAudio?.pause();
      if (audioTimer) window.clearTimeout(audioTimer);
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
      <div className="splash-armor-panels" />
      <div className="splash-background-sheen" />
      <div className="splash-center-gradient" />
      <div className="splash-outline-shell">
        <img
          src="/vgk-outline.svg"
          alt=""
          className="splash-outline-image"
        />
        <div className="splash-outline-glow-window">
          <img
            src="/vgk-outline.svg"
            alt=""
            className="splash-outline-glow-image"
          />
        </div>
        <svg
          className="splash-v-trace"
          viewBox="0 0 480 480"
          aria-hidden="true"
          focusable="false"
        >
          <filter id="splash-red-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.784 0 0 0 0 0.063 0 0 0 0 0.18 0 0 0 1 0"
              result="redBlur"
            />
            <feMerge>
              <feMergeNode in="redBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path
            className="splash-v-trace-path splash-v-trace-cover"
            d="M 224 398 L 148 181 L 219 214 L 240 305 L 266 219 L 340 178 L 262 398"
            pathLength="1"
          />
          <path
            className="splash-v-trace-path splash-v-trace-halo"
            d="M 224 398 L 148 181 L 219 214 L 240 305 L 266 219 L 340 178 L 262 398"
            pathLength="1"
          />
          <path
            className="splash-v-trace-path"
            d="M 224 398 L 148 181 L 219 214 L 240 305 L 266 219 L 340 178 L 262 398"
            pathLength="1"
          />
        </svg>
      </div>
    </div>
  );
}
