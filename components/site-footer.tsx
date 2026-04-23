import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <Container className="flex flex-col gap-4 py-8 text-sm text-mist md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>Golden Edge Analytics</p>
          <p className="text-xs text-mist/80">© 2026 Golden Edge Analytics. All rights reserved.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gold-bright"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
