import { prisma } from "@/lib/prisma";
import { HeroScrollVideo } from "@/components/sections/hero-scroll-video";
import { HeroContent } from "@/components/sections/hero-content";

interface HeroProps {
  locale?: string;
}

export async function Hero({ locale = "tr" }: HeroProps) {
  // Hero metinlerini DB'den çek, yoksa sabit fallback
  let title =
    locale === "en"
      ? "Your Strategic Partner\nin Legal Processes"
      : "Hukuki Süreçlerde\nStratejik Güç Ortağınız";
  let subtitle =
    locale === "en"
      ? "We manage complex legal processes with strong analysis and a strategic representation approach. We aim to produce sustainable and effective solutions while protecting our clients' rights."
      : "Karmaşık hukuki süreçleri güçlü analiz ve stratejik temsil anlayışıyla yönetiyoruz. Müvekkillerimizin haklarını korurken sürdürülebilir ve etkili çözümler üretmeyi hedefliyoruz.";
  let subtitle2 = "";

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: "hero" },
    });
    const map = Object.fromEntries(settings.map((s) => [s.key, s]));

    const titleKey = locale === "en" ? map.hero_title?.valueEn : map.hero_title?.valueTr;
    const sub1Key = locale === "en" ? map.hero_subtitle?.valueEn : map.hero_subtitle?.valueTr;
    const sub2Key = locale === "en" ? map.hero_subtitle2?.valueEn : map.hero_subtitle2?.valueTr;

    if (titleKey) title = titleKey;
    if (sub1Key) subtitle = sub1Key;
    if (sub2Key) subtitle2 = sub2Key;
  } catch {
    // DB erişilemiyorsa fallback kullan
  }

  // 200vh = 100vh sticky ekran + 100vh animasyon (20vh buffer da kaldırıldı)
  return (
    <div style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen bg-[#0a0a0a] overflow-hidden">

        {/* Mobil: dikey format Themis (portrait crop) */}
        <img
          src="/images/hero-mobile.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />

        {/* Desktop: fallback + canvas animation */}
        <div
          className="absolute inset-0 bg-cover hidden md:block"
          style={{
            backgroundImage: "url('/frames/themis/0150.jpg')",
            backgroundPosition: "center center",
          }}
        />
        <div className="hidden md:block">
          <HeroScrollVideo />
        </div>

        {/* Sol gradient — hafif, görseli korur */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/30 to-transparent z-10" />
        {/* Üst/alt karartma */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/40 z-10" />

        {/* İçerik — kelime kelime reveal animasyonu */}
        <HeroContent title={title} subtitle={subtitle} subtitle2={subtitle2 || undefined} />


      </div>
    </div>
  );
}
