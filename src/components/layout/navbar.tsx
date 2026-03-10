"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";

export interface PracticeAreaNav {
  slug: string;
  title: string;
  icon: string;
}

interface NavItem {
  href?: string;
  label: string;
  children?: { href: string; label: string }[];
}

function DropdownItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);

  const parentActive = item.children?.some((c) => isActive(c.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "relative inline-flex items-center gap-1 px-1 pb-1 pt-1 text-sm tracking-widest uppercase transition-colors",
          parentActive
            ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-white"
            : "text-white/60 hover:text-white"
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="min-w-[220px] bg-[#0a0a0a] border border-white/10 py-1">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block px-5 py-2.5 text-sm tracking-wide transition-colors",
                  isActive(child.href)
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar({ practiceAreas }: { practiceAreas?: PracticeAreaNav[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(tr|en)/, "") || "/";
    return href === "/" ? cleanPath === "/" : cleanPath.startsWith(href);
  };

  const practiceAreaChildren = practiceAreas && practiceAreas.length > 0
    ? practiceAreas.map((a) => ({
        href: `/uzmanlik-alanlari/${a.slug}`,
        label: a.title,
      }))
    : [];

  const navItems: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "/hakkimizda", label: t("about") },
    {
      label: t("practiceAreas"),
      href: "/uzmanlik-alanlari",
      children: practiceAreaChildren,
    },
    { href: "/ekibimiz", label: t("team") },
    { href: "/blog", label: t("blog") },
    { href: "/sss", label: t("faq") },
    { href: "/iletisim", label: t("contact") },
  ];

  return (
    <>
      <header
        className={cn(
          "bg-[#0a0a0a] transition-shadow duration-300",
          scrolled && "shadow-[0_1px_0_rgba(255,255,255,0.06)]"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src="/images/logo.png"
                alt="AEB Avukatlık Ortaklığı"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {navItems.map((item) =>
                item.children && item.children.length > 0 ? (
                  <DropdownItem key={item.label} item={item} isActive={isActive} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={cn(
                      "relative text-sm tracking-widest uppercase transition-colors pb-1",
                      isActive(item.href!)
                        ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-white"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right: Language + Mobile */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                type="button"
                className="md:hidden text-white/60 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Menüyü aç"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        practiceAreas={practiceAreas}
      />
    </>
  );
}
