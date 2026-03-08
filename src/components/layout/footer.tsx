"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  recentPosts?: { title: string; slug: string; date: string }[];
}

export function Footer({ recentPosts }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-[#050505] text-gray-400 border-t border-white/[0.03]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & Address */}
          <div>
            <Link href="/" className="inline-block text-xl font-bold tracking-wide text-white">
              HUKUK <span className="text-brand-400">BÜROSU</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {t("description")}
            </p>

            {/* Contact Info */}
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-sm text-gray-400">
                  Levent Mah. Hukuk Sok. No:1 Kat:5, Besiktas/Istanbul
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-sm text-gray-400">+90 212 123 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-sm text-gray-400">info@hukukburosu.com</span>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/ekibimiz"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {tNav("team")}
                </Link>
              </li>
              <li>
                <Link
                  href="/uzmanlik-alanlari"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {tNav("practiceAreas")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {tNav("blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {tNav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Recent Posts */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t("recentPosts")}
            </h3>
            {recentPosts && recentPosts.length > 0 ? (
              <ul className="space-y-4">
                {recentPosts.map((post, index) => (
                  <li key={index}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block text-sm text-gray-400 transition-colors hover:text-white leading-snug"
                    >
                      {post.title}
                    </Link>
                    <span className="mt-1 block text-xs text-gray-500">
                      {post.date}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                {t("noPostsYet")}
              </p>
            )}
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
              {t("newsletter")}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              {t("newsletterDescription")}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className={cn(
                  "w-full rounded-md border border-white/[0.03] bg-white/[0.03] px-4 py-2.5",
                  "text-sm text-white placeholder:text-gray-500",
                  "outline-none transition-colors focus:border-brand-500/30"
                )}
              />
              <button
                type="submit"
                className={cn(
                  "shrink-0 rounded-full bg-white px-4 py-2.5",
                  "font-bold text-black transition-opacity hover:opacity-90"
                )}
                aria-label={t("subscribe")}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {subscribed && (
              <p className="mt-3 text-sm text-brand-400 animate-in fade-in">
                {t("subscribeSuccess")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
