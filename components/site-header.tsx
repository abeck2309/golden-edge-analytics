"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  const homeItem = siteConfig.navigation.find((item) => item.href === "/");
  const aboutItem = siteConfig.navigation.find((item) => item.href === "/about");
  const menuItems = siteConfig.navigation.filter((item) => !["/", "/about"].includes(item.href));

  function isActiveHref(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  function NavLabel({ href, label }: { href: string; label: string }) {
    return (
      <span className="inline-flex items-center gap-2">
        {label}
        {href === "/vgk-updates" ? (
          <span
            aria-label="Live updates"
            className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.95)]"
          />
        ) : null}
      </span>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090c10]/88 backdrop-blur-xl">
      <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md"
          aria-label="Golden Edge Analytics home"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
            <Image
              src="/VGK.png"
              alt=""
              width={34}
              height={34}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-[0.08em] text-white">
              Golden Edge Analytics
            </p>
            <p className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-[0.22em] text-gold-bright">
              A Vegas Golden Knights Experience
            </p>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden flex-nowrap gap-1 md:flex">
          {siteConfig.navigation.map((item) => {
            const isActive = isActiveHref(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full border border-transparent px-3 py-2 text-xs font-semibold text-mist hover:border-gold/20 hover:text-white lg:px-4 lg:text-sm",
                  isActive && "border-gold/30 bg-gold/10 text-white"
                )}
              >
                <NavLabel href={item.href} label={item.label} />
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Mobile primary" className="relative flex gap-2 md:hidden">
          {homeItem ? (
            <Link
              href={homeItem.href}
              aria-current={isActiveHref(homeItem.href) ? "page" : undefined}
              className={cn(
                "rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-mist hover:border-gold/20 hover:text-white",
                isActiveHref(homeItem.href) && "border-gold/30 bg-gold/10 text-white"
              )}
            >
              {homeItem.label}
            </Link>
          ) : null}

          {aboutItem ? (
            <Link
              href={aboutItem.href}
              aria-current={isActiveHref(aboutItem.href) ? "page" : undefined}
              className={cn(
                "rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-mist hover:border-gold/20 hover:text-white",
                isActiveHref(aboutItem.href) && "border-gold/30 bg-gold/10 text-white"
              )}
            >
              {aboutItem.label}
            </Link>
          ) : null}

          <button
            type="button"
            aria-expanded={isMoreOpen}
            aria-controls="mobile-primary-menu"
            onClick={() => setIsMoreOpen((current) => !current)}
            className={cn(
              "rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-mist hover:border-gold/20 hover:text-white",
              menuItems.some((item) => isActiveHref(item.href)) && "border-gold/30 bg-gold/10 text-white"
            )}
          >
            More
          </button>

          {isMoreOpen ? (
            <div
              id="mobile-primary-menu"
              className="absolute right-0 top-12 z-50 grid min-w-56 gap-1 rounded-2xl border border-white/10 bg-[#090c10] p-2 shadow-glow"
            >
              {menuItems.map((item) => {
                const isActive = isActiveHref(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold text-mist hover:bg-gold/10 hover:text-white",
                      isActive && "bg-gold/10 text-white"
                    )}
                  >
                    <NavLabel href={item.href} label={item.label} />
                  </Link>
                );
              })}
            </div>
          ) : null}
        </nav>
      </Container>
    </header>
  );
}
