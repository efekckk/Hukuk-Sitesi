"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X, ChevronDown, Shield, Heart, Briefcase, Building2, Landmark, Home } from "lucide-react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Defer setState to avoid setState-in-effect lint error
      const t = setTimeout(() => setExpandedItems(new Set()), 0);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
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

  const practiceAreaChildren: NavChild[] =
    practiceAreas && practiceAreas.length > 0
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
          "fixed inset-0 z-50 bg-black/70 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 max-w-full bg-[#0a0a0a] border-l border-white/10 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <img
            src="/images/logo.png"
            alt="AEB Avukatlık Ortaklığı"
            className="h-8 w-auto"
          />
          <button
            type="button"
            className="p-1 text-white/40 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col overflow-y-auto flex-1 py-4">
          {navItems.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.has(item.translationKey);
              return (
                <div key={item.translationKey}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-3 text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors"
                    onClick={() => toggleExpand(item.translationKey)}
                  >
                    {t(item.translationKey)}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isExpanded ? "max-h-96" : "max-h-0"
                    )}
                  >
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 pl-10 pr-6 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
                          onClick={onClose}
                        >
                          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
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
                className="px-6 py-3 text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors"
                onClick={onClose}
              >
                {t(item.translationKey)}
              </Link>
            );
          })}
        </nav>

        {/* Contact CTA */}
        <div className="border-t border-white/10 p-6">
          <Link
            href="/iletisim"
            className="block w-full text-center border border-white/30 py-3 text-sm tracking-widest uppercase text-white transition-all hover:bg-white hover:text-[#0a0a0a]"
            onClick={onClose}
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </>
  );
}
