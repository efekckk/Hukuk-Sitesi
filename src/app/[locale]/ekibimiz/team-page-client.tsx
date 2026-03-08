"use client";

import { useState, useMemo } from "react";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string | null;
}

interface TeamPageClientProps {
  members: TeamMember[];
  allLabel: string;
}

export function TeamPageClient({ members, allLabel }: TeamPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const specialties = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.specialty) set.add(m.specialty);
    });
    return Array.from(set);
  }, [members]);

  const filtered = activeFilter === "all"
    ? members
    : members.filter((m) => m.specialty === activeFilter);

  return (
    <>
      {/* Filter Tabs */}
      {specialties.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
              activeFilter === "all"
                ? "bg-brand-700 text-white"
                : "bg-white/[0.06] text-neutral-400 hover:bg-white/[0.10]"
            )}
          >
            {allLabel}
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setActiveFilter(specialty)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeFilter === specialty
                  ? "bg-brand-700 text-white"
                  : "bg-white/[0.06] text-neutral-400 hover:bg-white/[0.10]"
              )}
            >
              {specialty}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filtered.map((member, index) => (
            <motion.div
              key={member.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative"
            >
              <div className="relative bg-[#111111] rounded-2xl overflow-hidden group-hover:bg-[#181818] transition-all duration-500">
                {/* Photo with grayscale-to-color */}
                <div className="relative h-72 bg-gradient-to-br from-white/[0.04] to-white/[0.06] flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <User className="w-24 h-24 text-white/20 group-hover:text-white/30 transition-colors duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-heading text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-400 text-sm font-medium uppercase tracking-wide mb-2">
                    {member.role}
                  </p>
                  <p className="text-neutral-500 text-sm">
                    {member.specialty}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
