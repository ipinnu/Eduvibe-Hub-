import Link from "next/link";
import { COPY } from "@/lib/constants";
import { LogoMark } from "./Nav";

export function Footer() {
  return (
    <footer className="bg-ev-ink py-12 text-white">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-4">
              <LogoMark />
              <span className="text-[22px] font-black tracking-[-0.04em]">{COPY.brand.compact}</span>
            </div>
            <p className="mt-4 font-display text-[18px] italic text-white/70">
              {COPY.footer.tagline}
            </p>
          </div>

          <div>
            <h2 className="font-mono text-label font-bold uppercase text-white/45">
              {COPY.footer.linksTitle}
            </h2>
            <nav className="mt-4 grid gap-2">
              {COPY.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="font-mono text-label font-bold uppercase text-white/45">
              {COPY.footer.contactTitle}
            </h2>
            <div className="mt-4 grid gap-2 text-body-sm text-white/70">
              {COPY.footer.contact.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 font-mono text-label-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{COPY.footer.copyright}</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/safeguarding" className="hover:text-white">Safeguarding</Link></nav>
          <p>
            {COPY.footer.creditPrefix}{" "}
            <Link href="/" className="text-ev-teal">
              {COPY.footer.credit}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
