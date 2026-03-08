"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Send, Loader2, CheckCircle } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 px-4 bg-green-900/20 rounded-lg border border-green-500/30">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <p className="text-green-300 font-medium">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
            {t("name")} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            {t("email")} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
            {t("phone")}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
            {t("subject")} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            minLength={3}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          {t("message")} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-y"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="kvkkConsent"
          name="kvkkConsent"
          required
          className="mt-1 w-4 h-4 text-secondary border-border rounded focus:ring-secondary"
        />
        <label htmlFor="kvkkConsent" className="text-sm text-muted-foreground">
          <Link href="/kvkk" className="text-secondary underline hover:text-secondary-light">
            {t("kvkkConsent")}
          </Link>{" "}
          *
        </label>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-light transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t("sending")}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {t("submit")}
          </>
        )}
      </button>
    </form>
  );
}
