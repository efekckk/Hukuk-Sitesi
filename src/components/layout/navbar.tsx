"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  Menu,
  ArrowRight,
  ChevronDown,
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
  Search,
  Users,
  Award,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchModal } from "@/components/search-modal";

export interface PracticeAreaNav {
  slug: string;
  title: string;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
};

interface NavChild {
  href: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

interface NavItem {
  href?: string;
  translationKey: string;
  children?: NavChild[];
  isMegaMenu?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Standard Dropdown (used for "Kurumsal" etc.)                      */
/* ------------------------------------------------------------------ */
function DesktopDropdown({
  item,
  isActive,
  t,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const parentActive =
    item.children?.some((child) => isActive(child.href)) ||
    (item.href && isActive(item.href));

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            parentActive
              ? "text-brand-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-brand-400 after:rounded-full"
              : "text-white/60 hover:text-brand-400"
          )}
        >
          {t(item.translationKey)}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Link>
      ) : (
        <button
          type="button"
          className={cn(
            "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            parentActive
              ? "text-brand-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-brand-400 after:rounded-full"
              : "text-white/60 hover:text-brand-400"
          )}
        >
          {t(item.translationKey)}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      )}

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 pt-2"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="min-w-[200px] rounded-xl border border-white/[0.04] bg-[#111]/95 backdrop-blur-xl py-2 shadow-2xl shadow-black/50">
              {item.children?.map((child) => {
                const Icon = child.icon;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      isActive(child.href)
                        ? "text-brand-400 bg-brand-400/10"
                        : "text-white/70 hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mega Menu Dropdown (used for "Uzmanlık Alanları")                 */
/* ------------------------------------------------------------------ */
function MegaMenuDropdown({
  item,
  isActive,
  t,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const parentActive =
    item.children?.some((child) => isActive(child.href)) ||
    (item.href && isActive(item.href));

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            parentActive
              ? "text-brand-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-brand-400 after:rounded-full"
              : "text-white/60 hover:text-brand-400"
          )}
        >
          {t(item.translationKey)}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Link>
      ) : (
        <button
          type="button"
          className={cn(
            "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            parentActive
              ? "text-brand-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-brand-400 after:rounded-full"
              : "text-white/60 hover:text-brand-400"
          )}
        >
          {t(item.translationKey)}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      )}

      {/* Mega Menu Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full -left-40 pt-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className={cn(
              "rounded-2xl border border-white/[0.04] bg-[#111]/98 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden",
              (item.children?.length ?? 0) > 4 ? "min-w-[600px]" : "min-w-[480px]"
            )}>
              {/* Header */}
              <div className="border-b border-white/[0.04] px-6 py-4">
                <h3 className="text-sm font-semibold text-white">
                  {t(item.translationKey)}
                </h3>
                <p className="mt-0.5 text-xs text-white/50">
                  {item.translationKey === "practiceAreas"
                    ? "Hukuki ihtiyaçlarınıza uygun uzmanlık alanını seçin"
                    : "Büromuz hakkında detaylı bilgi edinin"}
                </p>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-2 gap-1 p-3">
                {item.children?.map((child) => {
                  const Icon = child.icon;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "group flex items-start gap-3 rounded-xl px-4 py-3 transition-colors",
                        isActive(child.href)
                          ? "bg-brand-400/10 text-brand-400"
                          : "text-white/70 hover:bg-white/[0.03] hover:text-white"
                      )}
                    >
                      {Icon && (
                        <div
                          className={cn(
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors border border-white/[0.04]",
                            isActive(child.href)
                              ? "bg-brand-900/20 text-brand-400"
                              : "bg-white/[0.03] text-white/60 group-hover:bg-brand-900/20 group-hover:text-brand-400"
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="block text-sm font-medium leading-tight">
                          {child.label}
                        </span>
                        {child.description && (
                          <span className="mt-0.5 block text-xs leading-relaxed text-white/40 group-hover:text-white/50 transition-colors line-clamp-2">
                            {child.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer link */}
              {item.href && (
                <div className="border-t border-white/[0.04] bg-white/[0.03] px-6 py-3">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-400/80 transition-colors"
                  >
                    Tümünü Görüntüle
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Navbar                                                       */
/* ------------------------------------------------------------------ */
export function Navbar({ practiceAreas }: { practiceAreas?: PracticeAreaNav[] }) {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K / Cmd+K keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(tr|en)/, "") || "/";
    return href === "/" ? cleanPath === "/" : cleanPath.startsWith(href);
  };

  // Build practice area children from DB or fallback to translations
  // Include descriptions from translation keys for the mega menu
  const practiceAreaChildren: NavChild[] =
    practiceAreas && practiceAreas.length > 0
      ? practiceAreas.map((a) => {
          // Map slug to translation key for description
          const slugToKey: Record<string, string> = {
            "ceza-hukuku": "criminal",
            "aile-hukuku": "family",
            "is-hukuku": "labor",
            "ticaret-hukuku": "commercial",
            "idare-hukuku": "administrative",
            "gayrimenkul-hukuku": "realEstate",
          };
          const tKey = slugToKey[a.slug];
          const description = tKey
            ? tServices(`${tKey}.description`)
            : undefined;

          return {
            href: `/uzmanlik-alanlari/${a.slug}`,
            label: a.title,
            description,
            icon: iconMap[a.icon] || Shield,
          };
        })
      : [
          {
            href: "/uzmanlik-alanlari/ceza-hukuku",
            label: tServices("criminal.title"),
            description: tServices("criminal.description"),
            icon: Shield,
          },
          {
            href: "/uzmanlik-alanlari/aile-hukuku",
            label: tServices("family.title"),
            description: tServices("family.description"),
            icon: Heart,
          },
          {
            href: "/uzmanlik-alanlari/is-hukuku",
            label: tServices("labor.title"),
            description: tServices("labor.description"),
            icon: Briefcase,
          },
          {
            href: "/uzmanlik-alanlari/ticaret-hukuku",
            label: tServices("commercial.title"),
            description: tServices("commercial.description"),
            icon: Building2,
          },
          {
            href: "/uzmanlik-alanlari/idare-hukuku",
            label: tServices("administrative.title"),
            description: tServices("administrative.description"),
            icon: Landmark,
          },
          {
            href: "/uzmanlik-alanlari/gayrimenkul-hukuku",
            label: tServices("realEstate.title"),
            description: tServices("realEstate.description"),
            icon: Home,
          },
        ];

  const navItems: NavItem[] = [
    { href: "/", translationKey: "home" },
    {
      translationKey: "corporate",
      isMegaMenu: true,
      children: [
        { href: "/hakkimizda", label: t("about"), description: "Büromuzun hikayesi, misyonu ve vizyonu", icon: BookOpen },
        { href: "/ekibimiz", label: t("team"), description: "Deneyimli avukat kadromuzla tanışın", icon: Users },
        { href: "/degerlerimiz", label: t("values"), description: "Bizi yönlendiren ilke ve değerler", icon: Award },
      ],
    },
    {
      translationKey: "practiceAreas",
      href: "/uzmanlik-alanlari",
      children: practiceAreaChildren,
      isMegaMenu: true,
    },
    { href: "/blog", translationKey: "blog" },
    { href: "/sss", translationKey: "faq" },
  ];

  return (
    <>
      <header className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold tracking-wide text-white"
            >
              HUKUK <span className="text-brand-400">BUROSU</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) =>
                item.children ? (
                  item.isMegaMenu ? (
                    <MegaMenuDropdown
                      key={item.translationKey}
                      item={item}
                      isActive={isActive}
                      t={t}
                    />
                  ) : (
                    <DesktopDropdown
                      key={item.translationKey}
                      item={item}
                      isActive={isActive}
                      t={t}
                    />
                  )
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href!)
                        ? "text-brand-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-brand-400 after:rounded-full"
                        : "text-white/60 hover:text-brand-400"
                    )}
                  >
                    {t(item.translationKey)}
                  </Link>
                )
              )}
              <Link
                href="/iletisim"
                className={cn(
                  "ml-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold",
                  "bg-brand-700 text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-800/20"
                )}
              >
                {t("contact")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>

            {/* Right side: Search + Theme Toggle + Language Switcher + Mobile Menu Button */}
            <div className="flex items-center gap-3">
              {/* Search Button with Ctrl+K hint */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden md:inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white/40 hover:text-white/60 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.04] transition-colors"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
                <span className="text-xs font-mono bg-white/[0.05] text-white/30 rounded px-1.5 py-0.5">Ctrl+K</span>
              </button>

              <LanguageSwitcher />

              {/* Mobile hamburger button */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:text-brand-400 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        practiceAreas={practiceAreas}
      />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
