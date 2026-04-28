"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090c10]/88 backdrop-blur-xl">
      <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md"
          aria-label="Golden Edge Analytics home"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
            <Image
              src="/vgk-logo.png"
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

        <nav aria-label="Primary" className="flex flex-wrap gap-2">
          {siteConfig.navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-mist hover:border-gold/20 hover:text-white",
                  isActive && "border-gold/30 bg-gold/10 text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
