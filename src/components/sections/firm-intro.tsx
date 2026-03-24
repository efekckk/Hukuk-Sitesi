interface FirmIntroProps {
  locale?: string;
}

export function FirmIntro({ locale = "tr" }: FirmIntroProps) {
  const isTr = locale !== "en";

  const heading = isTr ? "AEB Hukuk" : "AEB Law";

  const p1 = isTr
    ? "Aşcı Etci Benglian Avukatlık Ortaklığı, bütün hukuki alanlarda, uzmanlık ve deneyimi bir araya getiren bağımsız bir avukatlık bürosudur."
    : "Aşçı Etci Benglian Law Partnership is an independent law firm that brings together expertise and experience in all areas of law.";

  const p2 = isTr
    ? "AEB Avukatlık Bürosu olarak özel kişilerden, orta ve büyük ölçekli şirketlere, devlet kuruluşlarından uluslararası ve küresel holdinglere kadar herkesin hukuki ihtiyaçlarına yönelik hizmet vermekteyiz."
    : "As AEB Law Firm, we provide legal services tailored to the needs of everyone — from individuals to mid and large-scale companies, state institutions to international and global holdings.";

  return (
    <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: "var(--space-2xl)" }}>

          {/* Sol — metin */}
          <div>
            <h2
              className="font-serif font-light text-[#1a1a1a] leading-[1.05]"
              style={{ fontSize: "var(--fs-4xl)", marginBottom: "1.5rem" }}
            >
              {heading}
            </h2>
            <p className="text-[#444] leading-[1.8]" style={{ fontSize: "var(--fs-base)", marginBottom: "1.5rem" }}>
              {p1}
            </p>
            <p className="text-[#666] leading-[1.8]" style={{ fontSize: "var(--fs-base)" }}>
              {p2}
            </p>
          </div>

          {/* Sağ — ekip fotoğrafı */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img
              src="/images/team-office.webp"
              alt="AEB Hukuk ekibi"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
