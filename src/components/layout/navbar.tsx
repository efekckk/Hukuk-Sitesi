"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchModal } from "@/components/search-modal";

export interface PracticeAreaNav {
  slug: string;
  title: string;
  icon: string;
}

interface NavItem {
  href: string;
  label: string;
}


export function Navbar({ practiceAreas }: { practiceAreas?: PracticeAreaNav[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Ctrl+K / Cmd+K global kısayolu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(tr|en)/, "") || "/";
    return href === "/" ? cleanPath === "/" : cleanPath.startsWith(href);
  };

  const navItems: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "/hakkimizda", label: t("about") },
    { href: "/hizmetlerimiz", label: t("practiceAreas") },
    { href: "/ekibimiz", label: t("team") },
    { href: "/sss", label: t("faq") },
    { href: "/iletisim", label: t("contact") },
  ];

  return (
    <>
      <header className={cn(
        "bg-[#0a0a0a] transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_rgba(255,255,255,0.06)]"
      )}>
        <div style={{ padding: "0 3rem" }}>
          <div className="flex items-center justify-between" style={{ height: "5rem" }}>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img src="/images/logo.png" alt="AEB Avukatlık Ortaklığı" style={{ height: "4rem", width: "auto" }} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center md:flex" style={{ gap: "2rem" }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative tracking-[0.12em] uppercase transition-colors pb-1",
                    isActive(item.href)
                      ? "text-white font-semibold"
                      : "text-white/55 hover:text-white"
                  )}
                  style={{ fontSize: "var(--fs-lg)" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right: E-Tahsilat + Search + Language + Mobile */}
            <div className="flex items-center" style={{ gap: "clamp(0.75rem, 1.2vw, 1.5rem)" }}>
              <a
                href="https://pos.param.com.tr/Tahsilat/Default.aspx?k=2524DFB2-A0F3-4A5A-B9DD-9A2A18B0E1BD"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center border border-[#b8975a]/60 tracking-[0.15em] uppercase text-[#b8975a] hover:bg-[#b8975a]/10 hover:border-[#b8975a] transition-colors"
                style={{ fontSize: "var(--fs-lg)", padding: "0.35em 0.8em" }}
              >
                E-Tahsilat
              </a>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Ara"
              >
                <Search style={{ width: "var(--fs-base)", height: "var(--fs-base)" }} />
                <span className="hidden lg:inline-flex items-center tracking-widest text-white/20 border border-white/10"                   style={{ fontSize: "var(--fs-xs)", padding: "0.2em 0.4em" }}>
                  ⌘K
                </span>
              </button>

              <LanguageSwitcher />

              <button
                type="button"
                className="md:hidden text-white/60 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Menüyü aç"
              >
                <Menu style={{ width: "var(--fs-xl)", height: "var(--fs-xl)" }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        practiceAreas={practiceAreas}
        onSearchOpen={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
      />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
