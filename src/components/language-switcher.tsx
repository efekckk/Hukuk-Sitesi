"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleLocaleChange(newLocale: "tr" | "en") {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5">
      {(["tr", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleLocaleChange(lang)}
          className={cn(
            "px-2.5 py-1 text-[11px] font-semibold tracking-widest transition-colors uppercase",
            locale === lang
              ? "bg-[#b8975a] text-white"
              : "bg-transparent text-white/40 hover:text-white"
          )}
          aria-label={lang === "tr" ? "Türkçe" : "English"}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
