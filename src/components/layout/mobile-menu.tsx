"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  X,
  ArrowRight,
  ChevronDown,
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PracticeAreaNav } from "./navbar";

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
  icon?: React.ElementType;
}

interface NavItem {
  href?: string;
  translationKey: string;
  children?: NavChild[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  practiceAreas?: PracticeAreaNav[];
}

export function MobileMenu({ isOpen, onClose, practiceAreas }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setExpandedItems(new Set());
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const practiceAreaChildren: NavChild[] = practiceAreas && practiceAreas.length > 0
    ? practiceAreas.map((a) => ({
        href: `/uzmanlik-alanlari/${a.slug}`,
        label: a.title,
        icon: iconMap[a.icon] || Shield,
      }))
    : [
        { href: "/uzmanlik-alanlari/ceza-hukuku", label: tServices("criminal.title"), icon: Shield },
        { href: "/uzmanlik-alanlari/aile-hukuku", label: tServices("family.title"), icon: Heart },
        { href: "/uzmanlik-alanlari/is-hukuku", label: tServices("labor.title"), icon: Briefcase },
        { href: "/uzmanlik-alanlari/ticaret-hukuku", label: tServices("commercial.title"), icon: Building2 },
        { href: "/uzmanlik-alanlari/idare-hukuku", label: tServices("administrative.title"), icon: Landmark },
        { href: "/uzmanlik-alanlari/gayrimenkul-hukuku", label: tServices("realEstate.title"), icon: Home },
      ];

  const navItems: NavItem[] = [
    { href: "/", translationKey: "home" },
    {
      translationKey: "corporate",
      children: [
        { href: "/hakkimizda", label: t("about") },
        { href: "/ekibimiz", label: t("team") },
        { href: "/degerlerimiz", label: t("values") },
      ],
    },
    {
      translationKey: "practiceAreas",
      href: "/uzmanlik-alanlari",
      children: practiceAreaChildren,
    },
    { href: "/blog", translationKey: "blog" },
    { href: "/sss", translationKey: "faq" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 max-w-full bg-[#0a0a0a] shadow-xl transition-transform duration-300 ease-in-out border-l border-white/[0.03]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-white/[0.03] px-4 py-4">
          <span className="text-lg font-bold tracking-wide text-white">
            HUKUK <span className="text-brand-400">BUROSU</span>
          </span>
          <button
            type="button"
            className="rounded-md p-2 text-white/60 hover:text-brand-400"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col px-4 py-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navItems.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.has(item.translationKey);
              return (
                <div key={item.translationKey}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-white/60 transition-colors hover:text-brand-400"
                    onClick={() => toggleExpand(item.translationKey)}
                  >
                    {t(item.translationKey)}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 rounded-md pl-6 pr-3 py-2.5 text-sm text-white/60 transition-colors hover:text-brand-400"
                          onClick={onClose}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className="rounded-md px-3 py-3 text-base font-medium text-white/60 transition-colors hover:text-brand-400"
                onClick={onClose}
              >
                {t(item.translationKey)}
              </Link>
            );
          })}
        </nav>

        {/* Contact CTA at bottom */}
        <div className="absolute bottom-8 left-4 right-4">
          <Link
            href="/iletisim"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-brand-700 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            onClick={onClose}
          >
            {t("contact")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
