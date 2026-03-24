export default function HizmetDetailLoading() {
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
            style={{ width: "20rem", height: "2.5rem", marginBottom: "0.75rem", borderRadius: "0.25rem" }}
          />
          <div
            className="bg-white/5 animate-pulse"
            style={{ width: "14rem", height: "0.75rem", borderRadius: "0.25rem" }}
          />
        </div>
      </div>

      {/* Content skeleton */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_340px]" style={{ gap: "var(--space-2xl)" }}>
          <div>
            <div className="bg-[#f0eeec] animate-pulse" style={{ width: "70%", height: "2rem", marginBottom: "var(--space-xl)", borderRadius: "0.25rem" }} />
            <div className="flex flex-col" style={{ gap: "0.75rem" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-[#f5f3f1] animate-pulse" style={{ width: `${90 - i * 8}%`, height: "1rem", borderRadius: "0.25rem" }} />
              ))}
            </div>
          </div>
          <div className="bg-[#f0eeec] animate-pulse" style={{ height: "20rem", borderRadius: "0.25rem" }} />
        </div>
      </section>
    </main>
  );
}
