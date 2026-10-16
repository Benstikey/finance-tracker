"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wallet, X } from "lucide-react";

export function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[6px] bg-[#0a0a0a] text-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Wallet size={size * 0.6} strokeWidth={2} />
    </span>
  );
}

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/blog", label: "Blog" },
];

// Mobile menu: the main links plus the ones only the footer shows on desktop.
const MOBILE_LINKS = [...LINKS, { href: "/privacy", label: "Privacy" }, { href: "/login", label: "Log in" }];

function isCurrent(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className="lp-btn lp-btn--sm lp-btn--secondary !px-2"
        aria-expanded={open}
        aria-controls="lp-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={16} strokeWidth={1.75} /> : <Menu size={16} strokeWidth={1.75} />}
      </button>
      {open && (
        <nav
          id="lp-mobile-menu"
          aria-label="Mobile"
          className="lp-pop absolute top-10 right-0 flex w-52 flex-col rounded-[14px] bg-white p-1.5 shadow-[0_4px_42px_#0000000f,0_2px_6px_#0000000d,0_0_0_1px_#0000000f]"
        >
          {MOBILE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(pathname, l.href) ? "page" : undefined}
              className="rounded-[8px] px-3 py-2 text-[14px] text-[#0a0a0a] hover:bg-[#0000000a] aria-[current=page]:font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="relative z-30 mx-auto flex h-[68px] max-w-[1056px] items-center justify-between gap-4 px-6">
      <div className="flex min-w-0 items-center gap-[30px]">
        <Link href="/" className="flex items-center gap-[7px]" aria-label="Finance home">
          <LogoMark />
          <span className="text-[15px] font-medium tracking-[-0.15px]">Finance</span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-0.5 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="lp-nav__link"
              aria-current={isCurrent(pathname, l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/login" className="lp-btn lp-btn--sm lp-btn--secondary hidden sm:inline-flex">
          Log in
        </Link>
        <Link href="/login" className="lp-btn lp-btn--sm lp-btn--primary">
          Get started
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e5e5e5]">
      <div className="mx-auto flex max-w-[1056px] flex-col gap-8 px-6 py-10 text-[13px] text-[#737373] sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-[7px] text-[#0a0a0a]">
            <LogoMark size={17} />
            <span className="font-medium">Finance</span>
          </span>
          <span>A private, multi-currency net worth tracker.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-12 gap-y-6">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-[#0a0a0a]">Product</span>
            <Link href="/features" className="hover:text-[#0a0a0a]">Features</Link>
            <Link href="/how-it-works" className="hover:text-[#0a0a0a]">How it works</Link>
            <Link href="/use-cases" className="hover:text-[#0a0a0a]">Use cases</Link>
            <Link href="/login" className="hover:text-[#0a0a0a]">Log in</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-[#0a0a0a]">Learn</span>
            <Link href="/blog" className="hover:text-[#0a0a0a]">Blog</Link>
            <Link href="/#faq" className="hover:text-[#0a0a0a]">FAQ</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-[#0a0a0a]">Trust</span>
            <Link href="/privacy" className="hover:text-[#0a0a0a]">Privacy</Link>
            <Link href="/privacy#security" className="hover:text-[#0a0a0a]">Security</Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
