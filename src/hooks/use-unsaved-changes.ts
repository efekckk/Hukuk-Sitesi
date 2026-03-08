"use client";

import { useEffect } from "react";

/**
 * Hook that warns users when they try to leave the page with unsaved changes.
 * Handles 3 scenarios:
 * 1. Browser close / refresh (beforeunload)
 * 2. In-app link clicks (capture phase click listener)
 * 3. Browser back/forward buttons (popstate)
 */
export function useUnsavedChanges(isDirty: boolean) {
  // 1. Browser close / tab refresh
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 2. In-app link clicks (Next.js client-side navigation)
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      if (anchor.target === "_blank") return;

      const confirmed = window.confirm(
        "Kaydedilmemiş değişiklikleriniz var. Bu sayfadan ayrılmak istiyor musunuz?"
      );

      if (!confirmed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Capture phase to intercept before Next.js router
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  // 3. Browser back/forward buttons
  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const confirmed = window.confirm(
        "Kaydedilmemiş değişiklikleriniz var. Bu sayfadan ayrılmak istiyor musunuz?"
      );
      if (!confirmed) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);
}
