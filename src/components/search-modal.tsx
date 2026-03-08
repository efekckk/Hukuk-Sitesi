"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Search,
  X,
  Scale,
  FileText,
  HelpCircle,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "practiceArea" | "blogPost" | "faq" | "team";
  title: string;
  description: string;
  href: string;
  icon?: string | null;
  image?: string | null;
  date?: string;
}

interface SearchResponse {
  results: {
    practiceAreas: SearchResult[];
    blogPosts: SearchResult[];
    faqItems: SearchResult[];
    teamMembers: SearchResult[];
  };
  totalCount: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryConfig = {
  practiceAreas: {
    label: { tr: "Uzmanlık Alanları", en: "Practice Areas" },
    icon: Scale,
    color: "text-brand-400",
    bg: "bg-brand-900/20",
  },
  blogPosts: {
    label: { tr: "Blog Yazıları", en: "Blog Posts" },
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-900/20",
  },
  faqItems: {
    label: { tr: "Sıkça Sorulan Sorular", en: "FAQ" },
    icon: HelpCircle,
    color: "text-amber-400",
    bg: "bg-amber-900/20",
  },
  teamMembers: {
    label: { tr: "Ekibimiz", en: "Our Team" },
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-900/20",
  },
} as const;

const quickLinks = [
  { label: { tr: "Ceza Hukuku", en: "Criminal Law" }, href: "/uzmanlik-alanlari/ceza-hukuku" },
  { label: { tr: "Aile Hukuku", en: "Family Law" }, href: "/uzmanlik-alanlari/aile-hukuku" },
  { label: { tr: "İş Hukuku", en: "Labor Law" }, href: "/uzmanlik-alanlari/is-hukuku" },
  { label: { tr: "Hakkımızda", en: "About Us" }, href: "/hakkimizda" },
  { label: { tr: "İletişim", en: "Contact" }, href: "/iletisim" },
];

function highlightMatch(text: string, query: string) {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-brand-900/30 text-brand-300 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const locale = useLocale();
  const isTr = locale === "tr";
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Collect all flat results for keyboard navigation
  const allResults: SearchResult[] = data
    ? [
        ...data.results.practiceAreas,
        ...data.results.blogPosts,
        ...data.results.faqItems,
        ...data.results.teamMembers,
      ]
    : [];

  const doSearch = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`
        );
        const json = await res.json();
        setData(json);
        setSelectedIndex(-1);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [locale]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setData(null);
      setSelectedIndex(-1);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allResults.length - 1
        );
      }
      if (e.key === "Enter" && selectedIndex >= 0 && allResults[selectedIndex]) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, selectedIndex, allResults]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("[data-result-item]");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const hasResults = data && data.totalCount > 0;
  const hasSearched = query.length >= 2;

  function renderCategory(
    key: keyof typeof categoryConfig,
    items: SearchResult[],
    startIndex: number
  ) {
    if (items.length === 0) return null;
    const config = categoryConfig[key];
    const Icon = config.icon;
    const label = isTr ? config.label.tr : config.label.en;

    return (
      <div key={key} className="mb-4 last:mb-0">
        <div className="flex items-center gap-2 px-4 py-2">
          <Icon className={cn("w-4 h-4", config.color)} />
          <span className={cn("text-xs font-semibold uppercase tracking-wider", config.color)}>
            {label}
          </span>
          <span className="text-xs text-white/30">({items.length})</span>
        </div>
        {items.map((item, i) => {
          const flatIndex = startIndex + i;
          const isSelected = flatIndex === selectedIndex;
          return (
            <Link
              key={`${key}-${i}`}
              href={item.href}
              onClick={onClose}
              data-result-item
              className={cn(
                "flex items-start gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-150",
                isSelected
                  ? "bg-brand-900/20 border border-brand-800/30"
                  : "hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5", config.bg)}>
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {highlightMatch(item.title, query)}
                </p>
                {item.description && (
                  <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                    {highlightMatch(item.description.slice(0, 100), query)}
                  </p>
                )}
              </div>
              <ArrowRight className={cn(
                "w-4 h-4 shrink-0 mt-1 transition-opacity",
                isSelected ? "text-brand-400 opacity-100" : "text-white/20 opacity-0 group-hover:opacity-100"
              )} />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Search Container */}
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Search Card */}
            <div className="rounded-2xl bg-[#111111]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4">
                {loading ? (
                  <Loader2 className="h-5 w-5 text-brand-400 shrink-0 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-white/40 shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder={isTr ? "Arama yapın..." : "Search..."}
                  className={cn(
                    "flex-1 bg-transparent text-base text-white placeholder:text-white/30",
                    "outline-none border-none focus:ring-0"
                  )}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setData(null);
                      inputRef.current?.focus();
                    }}
                    className="shrink-0 rounded-md p-1 text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs text-white/30 bg-white/[0.05] border border-white/[0.08] font-mono hover:bg-white/[0.08] transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.06]" />

              {/* Results area */}
              <div
                ref={resultsRef}
                className="max-h-[50vh] overflow-y-auto py-2"
              >
                {/* Loading state */}
                {loading && !data && (
                  <div className="px-5 py-8 text-center">
                    <Loader2 className="w-6 h-6 text-brand-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-white/50">
                      {isTr ? "Aranıyor..." : "Searching..."}
                    </p>
                  </div>
                )}

                {/* Results */}
                {hasSearched && !loading && hasResults && data && (
                  <>
                    {(() => {
                      let idx = 0;
                      const paStart = idx;
                      idx += data.results.practiceAreas.length;
                      const bpStart = idx;
                      idx += data.results.blogPosts.length;
                      const faqStart = idx;
                      idx += data.results.faqItems.length;
                      const tmStart = idx;
                      return (
                        <>
                          {renderCategory("practiceAreas", data.results.practiceAreas, paStart)}
                          {renderCategory("blogPosts", data.results.blogPosts, bpStart)}
                          {renderCategory("faqItems", data.results.faqItems, faqStart)}
                          {renderCategory("teamMembers", data.results.teamMembers, tmStart)}
                        </>
                      );
                    })()}
                    <div className="px-5 py-2 text-center border-t border-white/[0.06] mt-2">
                      <p className="text-xs text-white/30">
                        {data.totalCount} {isTr ? "sonuç bulundu" : "results found"}
                      </p>
                    </div>
                  </>
                )}

                {/* No results */}
                {hasSearched && !loading && !hasResults && (
                  <div className="px-5 py-8 text-center">
                    <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/50 font-medium">
                      {isTr
                        ? `"${query}" için sonuç bulunamadı`
                        : `No results for "${query}"`}
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      {isTr
                        ? "Farklı anahtar kelimeler deneyin"
                        : "Try different keywords"}
                    </p>
                  </div>
                )}

                {/* Default state — quick links */}
                {!hasSearched && !loading && (
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-1 mb-3">
                      {isTr ? "Hızlı Erişim" : "Quick Links"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] text-sm text-white/60 hover:bg-white/[0.08] hover:text-brand-400 transition-colors"
                        >
                          {isTr ? link.label.tr : link.label.en}
                        </Link>
                      ))}
                    </div>
                    <p className="text-xs text-white/30 mt-4 px-1">
                      {isTr
                        ? "Hukuki konular, blog yazıları veya uzmanlık alanlarını arayın..."
                        : "Search for legal topics, blog posts, or practice areas..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
