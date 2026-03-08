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
    <div className="flex items-center overflow-hidden rounded-md border border-border">
      <button
        type="button"
        onClick={() => handleLocaleChange("tr")}
        className={cn(
          "px-2.5 py-1 text-xs font-semibold transition-colors",
          locale === "tr"
            ? "bg-secondary text-white"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        )}
        aria-label="Turkce"
      >
        TR
      </button>
      <button
        type="button"
        onClick={() => handleLocaleChange("en")}
        className={cn(
          "px-2.5 py-1 text-xs font-semibold transition-colors",
          locale === "en"
            ? "bg-secondary text-white"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        )}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
