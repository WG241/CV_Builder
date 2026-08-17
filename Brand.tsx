import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-white font-bold text-sm shadow-sm">
        W
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-brand">{BRAND.name}</span>
        <span className="block text-[11px] text-ink-muted -mt-0.5">
          {BRAND.product}
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
        <BrandMark />
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line bg-white">
      <div className="mx-auto max-w-content px-4 py-6 text-xs text-ink-muted sm:px-6">
        <p>
          {BRAND.name} does not require user accounts or maintain a database of
          generated CVs. Information you enter is processed to generate your CV
          and is sent temporarily to a third-party AI provider (OpenAI) for
          that purpose. It is not intentionally stored by {BRAND.name} after your
          session.
        </p>
      </div>
    </footer>
  );
}
