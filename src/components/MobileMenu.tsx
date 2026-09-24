"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LangToggle } from "./LangToggle";
import { withLang, type Lang } from "@/lib/i18n";

type Labels = {
  ai: string;
  brands: string;
  entertainment: string;
  meet: string;
  open: string;
  close: string;
};

const dict: Record<Lang, Labels> = {
  en: {
    ai: "AI",
    brands: "BRANDED",
    entertainment: "ENTERTAINMENT",
    meet: "MEET",
    open: "Open menu",
    close: "Close menu",
  },
  pt: {
    ai: "AI",
    brands: "MARCAS",
    entertainment: "ENTRETENIMENTO",
    meet: "CONTATO",
    open: "Abrir menu",
    close: "Fechar menu",
  },
};

/**
 * Mobile-only hamburger menu. Renders a 3-line trigger fixed top-right;
 * tap opens a full-screen overlay with the nav stack at large type. The
 * desktop inline nav (Nav.tsx) hides this entire component above md.
 *
 * Why a hamburger here: the inline 11px nav strip survives technically
 * but disappears cognitively over full-bleed video content on a phone.
 * A high-contrast button + cinematic overlay reads as a real
 * navigational affordance.
 */
export function MobileMenu({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const t = dict[lang];

  // Lock body scroll while the overlay is open so swipes only move the
  // menu, not the page beneath it.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : original;
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Hamburger trigger — fixed top-right, mobile only. Sits above
          everything (z-60) so it stays tappable over hero videos and
          IPBrowser content. The 44×44 hit area meets Apple HIG. */}
      <button
        type="button"
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls="mobile-menu-overlay"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed top-3 right-3 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-colors active:bg-black/75"
        style={{ marginTop: "env(safe-area-inset-top)" }}
      >
        <span className="relative block h-4 w-5" aria-hidden>
          {/* Three lines that morph into an X when open. Each line is
              positioned absolutely so the rotation/translate plays from
              the same anchor point. */}
          <span
            className={`absolute left-0 right-0 h-[2px] bg-white transition-all duration-200 [text-shadow:_0_1px_2px_rgba(0,0,0,0.45)] ${
              open ? "top-[7px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 right-0 top-[7px] h-[2px] bg-white transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 right-0 h-[2px] bg-white transition-all duration-200 ${
              open ? "top-[7px] -rotate-45" : "top-[14px]"
            }`}
          />
        </span>
      </button>

      {/* Full-screen overlay. Mounted always so the slide animation
          plays in both directions, but pointer-events disabled when
          closed so it doesn't block clicks on the page beneath. */}
      <div
        id="mobile-menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-50 bg-background transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          className="flex h-full w-full flex-col px-6 pb-10"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 4.5rem)",
            paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
          }}
        >
          {/* Big nav stack — Unbounded display type, vermillion on tap */}
          <ul className="flex flex-1 flex-col justify-center gap-2 font-display font-medium leading-[1.05] tracking-[-0.02em]">
            {[
              { href: "/", label: "HOME" },
              { href: "/ai", label: t.ai },
              { href: "/branded", label: t.brands },
              { href: "/entertainment", label: t.entertainment },
              { href: "/meet", label: t.meet },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={withLang(link.href, lang)}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-foreground hover:text-accent active:text-accent transition-colors"
                  style={{ fontSize: "clamp(33px, 8vw, 53px)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer rail inside overlay — lang toggle + wordmark */}
          <div className="mt-8 flex items-end justify-between font-mono text-[11px] tracking-[0.08em] text-muted">
            <span>FRANCISCOALENCAR.COM</span>
            <LangToggle lang={lang} />
          </div>
        </nav>
      </div>
    </>
  );
}
