import { prisma } from "@/lib/prisma";
import { HeroScrollVideo } from "@/components/sections/hero-scroll-video";

interface HeroProps {
  locale?: string;
}

export async function Hero({ locale = "tr" }: HeroProps) {
  // Hero metinlerini DB'den çek, yoksa sabit fallback
  let title = "Hukuki Süreçlerde\nStratejik Güç Ortağınız";
  let subtitle =
    "AEB Hukuk; ticaret hukuku, uyuşmazlık çözümü ve kurumsal danışmanlık alanlarında uzmanlaşmış, çok disiplinli bir ekip ile faaliyet göstermektedir.";
  let subtitle2 =
    "Hizmet anlayışımız, güçlü hukuki analiz ve sürdürülebilir çözüm üretme kapasitesine dayanır.";

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

        {/* Fallback: JS yüklenmeden önce ilk frame */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/frames/themis/0150.jpg')",
            backgroundPosition: "center right",
          }}
        />

        {/* Canvas image sequence */}
        <HeroScrollVideo />

        {/* Sol gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent z-10" />
        {/* Üst/alt karartma */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]/50 z-10" />

        {/* İçerik — sol üst, viewport'a orantılı tipografi */}
        <div className="absolute inset-0 z-20 flex items-start pt-[13vh] px-[5vw]">
          <div style={{ maxWidth: "44vw" }}>
            <h1
              className="font-serif font-light leading-[1.08] text-white"
              style={{ fontSize: "clamp(2.2rem, 4vw, 5.5rem)" }}
            >
              {title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p
              className="mt-8 leading-relaxed text-white/50"
              style={{
                fontSize: "clamp(0.78rem, 1.05vw, 1rem)",
                maxWidth: "clamp(260px, 28vw, 440px)",
              }}
            >
              {subtitle}
            </p>
            {subtitle2 && (
              <p
                className="mt-3 leading-relaxed text-white/50"
                style={{
                  fontSize: "clamp(0.78rem, 1.05vw, 1rem)",
                  maxWidth: "clamp(260px, 28vw, 440px)",
                }}
              >
                {subtitle2}
              </p>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
