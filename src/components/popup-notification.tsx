"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface PopupData {
  id: string;
  titleTr: string;
  titleEn: string | null;
  messageTr: string;
  messageEn: string | null;
  type: string;
  linkUrl: string | null;
  linkTextTr: string | null;
  linkTextEn: string | null;
}

interface PopupNotificationProps {
  popups: PopupData[];
  locale: string;
}

const STORAGE_KEY = "dismissed-popups";

function getDismissed(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addDismissed(id: string) {
  const dismissed = getDismissed();
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
  }
}

export function PopupNotification({ popups, locale }: PopupNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    const dismissed = getDismissed();
    const firstUndismissed = popups.findIndex((p) => !dismissed.includes(p.id));
    const t = setTimeout(() => setCurrentIndex(firstUndismissed >= 0 ? firstUndismissed : null), 0);
    return () => clearTimeout(t);
  }, [popups]);

  const dismiss = useCallback(() => {
    if (currentIndex === null) return;
    const popup = popups[currentIndex];
    addDismissed(popup.id);

    const dismissed = getDismissed();
    const nextIndex = popups.findIndex((p, i) => i > currentIndex && !dismissed.includes(p.id));
    setCurrentIndex(nextIndex >= 0 ? nextIndex : null);
  }, [currentIndex, popups]);

  if (currentIndex === null || !popups[currentIndex]) return null;

  const popup = popups[currentIndex];
  const title = (locale === "en" && popup.titleEn) ? popup.titleEn : popup.titleTr;
  const message = (locale === "en" && popup.messageEn) ? popup.messageEn : popup.messageTr;
  const linkText = (locale === "en" && popup.linkTextEn) ? popup.linkTextEn : popup.linkTextTr;

  if (popup.type === "banner") {
    return (
      <AnimatePresence>
        <motion.div
          key={popup.id}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-emerald-900 to-emerald-800 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                <strong>{title}</strong>
                <span className="mx-2 opacity-60">—</span>
                <span className="opacity-90">{message}</span>
              </p>
              {popup.linkUrl && linkText && (
                <Link
                  href={popup.linkUrl}
                  className="shrink-0 bg-white text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {linkText}
                </Link>
              )}
            </div>
            <button
              onClick={dismiss}
              className="shrink-0 ml-3 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Modal type
  return (
    <AnimatePresence>
      <motion.div
        key={popup.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={dismiss}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative bg-[#111111] rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-white/[0.06]"
        >
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-14 h-14 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">{message}</p>

          {popup.linkUrl && linkText && (
            <Link
              href={popup.linkUrl}
              onClick={dismiss}
              className="inline-block bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors"
            >
              {linkText}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
