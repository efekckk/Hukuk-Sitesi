export default function HizmetlerimizLoading() {
  return (
    <main className="bg-white">
      {/* Hero skeleton */}
      <div
        className="relative bg-[#0a0a0a] overflow-hidden flex items-end"
        style={{
          minHeight: "clamp(18rem, 40vh, 28rem)",
          paddingLeft: "var(--section-px)",
          paddingRight: "var(--section-px)",
          paddingBottom: "clamp(2rem, 4vw, 3.5rem)",
        }}
      >
        <div className="mx-auto max-w-7xl w-full">
          <div
            className="bg-white/10 animate-pulse"
            style={{ width: "16rem", height: "2.5rem", marginBottom: "0.75rem", borderRadius: "0.25rem" }}
          />
          <div
            className="bg-white/5 animate-pulse"
            style={{ width: "12rem", height: "0.75rem", borderRadius: "0.25rem" }}
          />
        </div>
      </div>

      {/* Content skeleton */}
      <section style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(0.5rem, 0.8vw, 1rem)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#f0eeec] animate-pulse"
                style={{ aspectRatio: "4/3", borderRadius: "0.125rem" }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
