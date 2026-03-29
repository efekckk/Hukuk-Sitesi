"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Loader2, CheckCircle, X } from "lucide-react";

/* Ortak input className */
const fieldClass =
  "w-full px-0 py-3 bg-transparent border-0 border-b border-black/20 text-[#1a1a1a] text-sm placeholder:text-black/30 focus:outline-none focus:border-black transition-colors";

const labelClass = "block text-xs tracking-[0.15em] uppercase text-black/40 mb-2";

function KvkkModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || content) return;
    setLoading(true);
    fetch("/api/page-content?slug=kvkk")
      .then((r) => r.json())
      .then((data) => setContent(data.contentTr || data.data?.contentTr || ""))
      .catch(() => setContent("İçerik yüklenemedi."))
      .finally(() => setLoading(false));
  }, [open, content]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    const lenis = (window as any).__lenis;
    if (lenis) lenis.stop();
    document.documentElement.setAttribute("data-lenis-prevent", "");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      document.documentElement.removeAttribute("data-lenis-prevent");
      if (lenis) lenis.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: "2rem" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[80vh] bg-white overflow-hidden flex flex-col" style={{ borderRadius: "0.5rem" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10" style={{ padding: "1rem 1.5rem" }}>
          <h2 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-lg)" }}>
            Kişisel Verilerin Korunması
          </h2>
          <button onClick={onClose} className="text-black/30 hover:text-black transition-colors cursor-pointer">
            <X style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto" style={{ padding: "1.5rem" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-black/20" />
            </div>
          ) : content ? (
            <div
              className="prose prose-sm max-w-none text-[#444] leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-black/40">İçerik bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const closeKvkk = useCallback(() => setKvkkOpen(false), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      kvkkConsent: formData.get("kvkkConsent") === "on",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed");
      }

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center border-t border-black/10">
        <CheckCircle className="w-10 h-10 text-black/30 mx-auto mb-4" />
        <p className="font-serif text-xl font-light text-[#1a1a1a]">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t("name")} *
          </label>
          <input type="text" id="name" name="name" required minLength={2} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")} *
          </label>
          <input type="email" id="email" name="email" required className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t("phone")}
          </label>
          <input type="tel" id="phone" name="phone" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            {t("subject")} *
          </label>
          <input type="text" id="subject" name="subject" required minLength={3} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t("message")} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {/* KVKK */}
      <div className="flex items-start gap-4 pt-2">
        <input
          type="checkbox"
          id="kvkkConsent"
          name="kvkkConsent"
          required
          className="mt-0.5 w-4 h-4 border-black/20 accent-black"
        />
        <label htmlFor="kvkkConsent" className="text-xs leading-relaxed text-[#777]">
          <button
            type="button"
            onClick={() => setKvkkOpen(true)}
            className="underline underline-offset-2 text-[#555] hover:text-black cursor-pointer"
          >
            {t("kvkkConsent")}
          </button>{" "}
          *
        </label>
      </div>

      <KvkkModal open={kvkkOpen} onClose={closeKvkk} />

      {error && (
        <p className="text-xs text-red-700 border-l-2 border-red-300 pl-3">{error}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group disabled:opacity-40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black/40" />
              {t("sending")}
            </>
          ) : (
            <>
              <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
