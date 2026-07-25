import Image from "next/image";
import Link from "next/link";
import type { AuthPanelSettings } from "@/lib/data/settings";

export function AuthShell({
  title,
  subtitle,
  panel,
  children,
}: {
  title: string;
  subtitle: string;
  panel: AuthPanelSettings;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="text-xs font-medium text-kida-purple hover:underline">
            &larr; Back to KIDA
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-kida-charcoal lg:block">
        <Image src={panel.image_url} alt="" fill sizes="50vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-kida-purple/90 via-kida-charcoal/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <blockquote className="font-heading text-2xl font-medium text-balance">&ldquo;{panel.quote}&rdquo;</blockquote>
          <p className="mt-4 text-sm text-white/70">— {panel.quote_author}</p>
        </div>
      </div>
    </div>
  );
}
