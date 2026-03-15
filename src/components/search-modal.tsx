"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search, X, Loader2 } from "lucide-react";
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

const categoryLabels = {
  practiceAreas: { tr: "Uzmanlık Alanları", en: "Practice Areas" },
  blogPosts:     { tr: "Yayınlar",          en: "Publications"    },
  faqItems:      { tr: "Sıkça Sorulan",     en: "FAQ"             },
  teamMembers:   { tr: "Ekibimiz",          en: "Team"            },
} as const;

function highlightMatch(text: string, query: string) {
  if (!query || query.length < 2) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-black/10 text-[#1a1a1a] not-italic">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const locale = useLocale();
  const isTr = locale === "tr";
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const allResults: SearchResult[] = data
    ? [
        ...data.results.practiceAreas,
        ...data.results.blogPosts,
        ...data.results.faqItems,
        ...data.results.teamMembers,
      ]
    : [];

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setData(null); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`);
      setData(await res.json());
      setSelectedIndex(-1);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 280);
  };

  /* open/close side-effects */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
      setQuery(""); setData(null); setSelectedIndex(-1);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(p => p < allResults.length - 1 ? p + 1 : 0);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(p => p > 0 ? p - 1 : allResults.length - 1);
      }
      if (e.key === "Enter" && selectedIndex >= 0) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, selectedIndex, allResults.length]);

  /* scroll selected into view */
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("[data-item]");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const hasResults = data && data.totalCount > 0;
  const hasSearched = query.length >= 2;

  /* render a category group */
  function renderGroup(
    key: keyof typeof categoryLabels,
    items: SearchResult[],
    startIdx: number
  ) {
    if (!items.length) return null;
    const label = isTr ? categoryLabels[key].tr : categoryLabels[key].en;
    return (
      <div key={key}>
        <p className="px-6 pt-5 pb-2 text-[10px] tracking-[0.2em] uppercase text-black/30">
          {label}
        </p>
        {items.map((item, i) => {
          const flat = startIdx + i;
          const selected = flat === selectedIndex;
          return (
            <Link
              key={`${key}-${i}`}
              href={item.href}
              onClick={onClose}
              data-item
              className={cn(
                "flex items-start gap-4 px-6 py-4 transition-colors",
                selected ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base font-light text-[#1a1a1a] truncate">
                  {highlightMatch(item.title, query)}
                </p>
                {item.description && (
                  <p className="text-xs leading-relaxed text-[#888] line-clamp-1 mt-0.5">
                    {item.description.slice(0, 110)}
                  </p>
                )}
              </div>
              <span className={cn(
                "text-xs tracking-[0.1em] uppercase text-black/20 shrink-0 mt-1 transition-opacity",
                selected ? "opacity-100" : "opacity-0"
              )}>→</span>
            </Link>
          );
        })}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl mx-4 bg-white shadow-2xl shadow-black/10 overflow-hidden">

        {/* Input row */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-black/[0.08]">
          {loading
            ? <Loader2 className="w-4 h-4 text-black/30 shrink-0 animate-spin" />
            : <Search className="w-4 h-4 text-black/30 shrink-0" />
          }
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={isTr ? "Ara..." : "Search..."}
            className="flex-1 bg-transparent text-[#1a1a1a] font-serif text-lg font-light placeholder:text-black/25 outline-none"
          />
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setData(null); inputRef.current?.focus(); }}
                className="text-black/30 hover:text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="text-[10px] tracking-widest text-black/20 border border-black/10 px-1.5 py-0.5">
              ESC
            </span>
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[55vh] overflow-y-auto">

          {/* No query yet — hint */}
          {!hasSearched && !loading && (
            <div className="px-6 py-8 text-center">
              <p className="font-serif text-sm font-light text-black/30">
                {isTr
                  ? "Uzmanlık alanları, yayınlar veya ekip üyelerini arayın"
                  : "Search practice areas, publications or team members"}
              </p>
            </div>
          )}

          {/* Results by category */}
          {hasSearched && !loading && hasResults && data && (() => {
            let idx = 0;
            const pa = idx; idx += data.results.practiceAreas.length;
            const bp = idx; idx += data.results.blogPosts.length;
            const fq = idx; idx += data.results.faqItems.length;
            const tm = idx;
            return (
              <>
                {renderGroup("practiceAreas", data.results.practiceAreas, pa)}
                {renderGroup("blogPosts",     data.results.blogPosts,     bp)}
                {renderGroup("faqItems",      data.results.faqItems,      fq)}
                {renderGroup("teamMembers",   data.results.teamMembers,   tm)}
              </>
            );
          })()}

          {/* No results */}
          {hasSearched && !loading && !hasResults && (
            <div className="px-6 py-10 text-center">
              <p className="font-serif text-base font-light text-black/40">
                {isTr ? `"${query}" için sonuç bulunamadı` : `No results for "${query}"`}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        {hasResults && data && (
          <div className="border-t border-black/[0.06] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.15em] uppercase text-black/25">
              {data.totalCount} {isTr ? "sonuç" : "results"}
            </p>
            <p className="text-[10px] text-black/20">
              ↑↓ {isTr ? "gezin" : "navigate"} · ↵ {isTr ? "aç" : "open"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
