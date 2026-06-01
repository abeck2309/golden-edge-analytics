import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { stanleyCupFinalMode } from "@/lib/finals-mode";

export function StanleyCupFinalBanner() {
  if (!stanleyCupFinalMode.enabled) {
    return null;
  }

  return (
    <div className="border-b border-gold/20 bg-[linear-gradient(90deg,rgba(185,151,91,0.18),rgba(200,16,46,0.12),rgba(185,151,91,0.18))]">
      <Container className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-black/45">
              <Image src="/VGK.svg" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 bg-black/45">
              <Image src="/CAR.svg" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
            </span>
          </div>
          <div>
            <p className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-[0.18em] text-gold-bright">
              Stanley Cup Final Mode
            </p>
            <p className="text-xs font-semibold text-frost/85 sm:text-sm">
              {stanleyCupFinalMode.fullMatchupLabel}
            </p>
          </div>
        </div>
        <Link
          href="/vgk-updates#live-game"
          className="inline-flex items-center justify-center rounded-full border border-gold/35 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-bright hover:bg-gold/10"
        >
          Open Game Center
        </Link>
      </Container>
    </div>
  );
}
