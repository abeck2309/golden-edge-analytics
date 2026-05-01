import Link from "next/link";

export function ArticlePlayerLink({ children, playerId }: { children: React.ReactNode; playerId: number }) {
  return (
    <Link
      href={`/players/${playerId}`}
      className="font-semibold text-white underline decoration-gold/40 underline-offset-4 hover:text-gold-bright"
    >
      {children}
    </Link>
  );
}
