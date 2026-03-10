"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const t = useTranslations("cookie");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Defer to avoid setState-in-effect lint error
      const t = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#111111]/95 backdrop-blur-md border-t border-white/[0.04] shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Cookie className="w-6 h-6 text-secondary shrink-0" />
          <p className="text-sm text-muted-foreground">
            {t("message")}{" "}
            <Link
              href="/cerez-politikasi"
              className="text-secondary underline hover:text-secondary-light"
            >
              {t("learnMore")}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
          >
            {t("reject")}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-secondary-light transition-colors"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
