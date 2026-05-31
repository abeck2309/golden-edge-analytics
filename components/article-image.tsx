"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ArticleImageProps = {
  src: string;
  alt: string;
  credit: string;
  figureClassName: string;
  aspectClassName: string;
  imageClassName?: string;
};

export function ArticleImage({
  src,
  alt,
  credit,
  figureClassName,
  aspectClassName,
  imageClassName = "object-cover"
}: ArticleImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <figure className={figureClassName}>
        <div className={`relative w-full ${aspectClassName}`}>
          <button
            type="button"
            aria-label="Expand image"
            onClick={() => setIsOpen(true)}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-black/70 text-gold-bright transition hover:border-gold-bright hover:text-white"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H3v5" />
              <path d="M3 3l7 7" />
              <path d="M16 21h5v-5" />
              <path d="M21 21l-7-7" />
              <path d="M21 8V3h-5" />
              <path d="M21 3l-7 7" />
              <path d="M8 21H3v-5" />
              <path d="M3 21l7-7" />
            </svg>
          </button>

          <Image src={src} alt={alt} fill className={imageClassName} />
        </div>
        <figcaption className="border-t border-line px-4 py-3 text-xs uppercase tracking-[0.14em] text-mist">
          {credit}
        </figcaption>
      </figure>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={() => setIsOpen(false)}
              className="absolute right-0 top-[-3rem] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:border-gold-bright hover:text-gold-bright"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

            <div className="relative h-[80vh] w-full overflow-hidden rounded-[1.6rem] border border-line bg-black">
              <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.16em] text-mist">
              {credit}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
