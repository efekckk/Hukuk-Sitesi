"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Eski hardcoded liste kaldırıldı — artık DB'den prop olarak geliyor

const LEGACY_STAFF: readonly string[] = [
  "Ahmet Can Ünsal",
  "Alara Su Çiçek",
  "Ali Eren Metin",
  "Ali Erhan Dinç",
  "Ali Ertunç Şen",
  "Aslı Merve Çil",
  "Aydın Arslan",
  "Barış Etci",
  "Berkay Özen",
  "Birgül Aksu",
  "Burcu Kerzik Demirci",
  "Büşra Caf",
  "Büşra Çevik",
  "Canan Bilgin",
  "Cansu Kasap",
  "Cihat Oğuz Erdil",
  "Derya Abay",
  "Duygu Kaynar",
  "Elif Ergenekon",
  "Fadime Nur Tataroğlu",
  "Fatih Çağlayan",
  "Feiza Polat",
  "Figen Ekin Başpınar Arman",
  "Gökhan Kaymaktürk",
  "Gözde Çiftçi",
  "Gülnihan Kara Etci",
  "Gürhan Ayhan",
  "Hacıhanım Çakır",
  "Hakan Şener",
  "Hande Nurgönül",
  "Hatice Temiz",
  "İrem Aslan",
  "İrem Kudat",
  "Leyla Çaça",
  "Liana Benglian",
  "Mehmet Arabacı",
  "Melisa Al",
  "Meryem Nur Makovall",
  "Metehan Bekir Yıldız",
  "Muhammet Özyavaş",
  "Nergiz Samura Şahin",
  "Nurullah Akpolat",
  "Özge İçel",
  "Özlem Ay",
  "Özlem Yaltalıöz",
  "Saro Arşen Benglian",
  "Sefa Duman",
  "Selahaddin Tufan",
  "Sema Arıkan",
  "Serkan Timur",
  "Serpil Kasap",
  "Sezen Dinç",
  "Sıla Dede",
  "Süleyman Kargı",
  "Şevket Öztürk",
  "Talha Ebrar Sarıca",
  "Taner Öztürk",
  "Turgay Aşcı",
  "Volkan Güngör",
  "Yaprak Demir Hüneroğlu",
  "Yaren Temiz",
  "Yeter Uludağlar",
  "Yonca Yılmaz Yavuz",
];

function normalize(str: string): string {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g");
}

interface TeamSearchProps {
  locale?: string;
  members?: string[];
}

export function TeamSearch({ locale = "tr", members }: TeamSearchProps) {
  // DB üyeleri + LEGACY_STAFF birleştir, tekrarları kaldır
  const staffList = useMemo(() => {
    const set = new Set<string>(LEGACY_STAFF);
    if (members) {
      for (const name of members) set.add(name);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "tr"));
  }, [members]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isTr = locale !== "en";

  const close = useCallback(() => { setOpen(false); setQuery(""); }, []);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Modal açıkken tüm scroll'u kilitle (Lenis + native)
  useEffect(() => {
    if (!open) return;

    // Native scroll kilitle
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    // Lenis'i durdur — hem global instance hem de DOM attribute
    const lenis = (window as any).__lenis;
    if (lenis) lenis.stop();
    document.documentElement.setAttribute("data-lenis-prevent", "");

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);

      document.documentElement.removeAttribute("data-lenis-prevent");
      if (lenis) lenis.start();
    };
  }, [open]);

  // Arama yoksa tüm listeyi göster, varsa filtrele
  const filtered = useMemo(() => {
    const q = query.trim();
    if (q.length === 0) return staffList.slice();
    return staffList.filter((name) => normalize(name).includes(normalize(q)));
  }, [query, staffList]);

  return (
    <>
      {/* Floating buton — "Ekibimiz" */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2.5 bg-[#1a1a1a] border border-white/[0.08] text-white/60 hover:bg-[#252525] hover:text-white transition-all duration-300 shadow-lg shadow-black/30"
        style={{ padding: "0.65rem 1.2rem 0.65rem 0.9rem", borderRadius: "9999px" }}
      >
        <Users style={{ width: "1.1rem", height: "1.1rem" }} />
        <span className="tracking-[0.12em] uppercase" style={{ fontSize: "var(--fs-micro)" }}>
          {isTr ? "Ekibimiz" : "Our Team"}
        </span>
      </button>

      {/* Modal — tüm isimler + arama */}
      {open && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-start justify-center"
          style={{ paddingTop: "clamp(3rem, 10vh, 6rem)" }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <div
            className="relative z-10 w-full bg-[#111] border border-white/10"
            style={{ maxWidth: "36rem", margin: "0 var(--section-px)" }}
          >
            {/* Header + Search */}
            <div className="border-b border-white/10" style={{ padding: "1.25rem 1.25rem 0" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "1rem" }}>
                <h2 className="font-serif font-light text-white/90" style={{ fontSize: "var(--fs-lg)" }}>
                  {isTr ? "Ekibimiz" : "Our Team"}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X style={{ width: "1.1rem", height: "1.1rem" }} />
                </button>
              </div>
              <div className="flex items-center bg-white/[0.05]" style={{ padding: "0 0.85rem", marginBottom: "1.25rem", borderRadius: "0.5rem" }}>
                <Search className="text-white/25 shrink-0" style={{ width: "1rem", height: "1rem" }} />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isTr ? "İsim ara..." : "Search name..."}
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 outline-none"
                  style={{ padding: "0.75rem 0.65rem", fontSize: "var(--fs-sm)" }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-white/25 hover:text-white/50 transition-colors"
                  >
                    <X style={{ width: "0.9rem", height: "0.9rem" }} />
                  </button>
                )}
              </div>
            </div>

            {/* İsim listesi */}
            <div data-team-list style={{ maxHeight: "24rem", overflowY: "auto", overscrollBehavior: "contain" }}>
              {filtered.length === 0 ? (
                <p className="text-white/25 text-center" style={{ padding: "2rem 1rem", fontSize: "var(--fs-sm)" }}>
                  {isTr ? "Sonuç bulunamadı" : "No results found"}
                </p>
              ) : (
                <ul>
                  {filtered.map((name) => (
                    <li
                      key={name}
                      className="flex items-center border-b border-white/5 text-white/80 last:border-b-0"
                      style={{ padding: "0.75rem 1.25rem", gap: "0.75rem", fontSize: "var(--fs-sm)" }}
                    >
                      <span
                        className="shrink-0 flex items-center justify-center rounded-full bg-white/[0.07] text-white/35"
                        style={{ width: "2rem", height: "2rem", fontSize: "var(--fs-micro)" }}
                      >
                        {name.charAt(0)}
                      </span>
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10" style={{ padding: "0.5rem" }} />
          </div>
        </div>
      )}
    </>
  );
}
