"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Users } from "lucide-react";
import { TeamMemberModal } from "@/components/bento/team-member-modal";
import { ScrollReveal } from "@/components/scroll-reveal";

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string | null;
}

interface TeamCinematicProps {
  members: TeamMember[];
}

export function TeamCinematic({ members }: TeamCinematicProps) {
  const t = useTranslations("team");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (members.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <img
          src="/images/cinematic/bg-dark-texture.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="w-14 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 rounded-full mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-3">
              {t("title")}
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Team cards */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {members.slice(0, 3).map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onClick={() => setSelectedMember(member)}
              className="group cursor-pointer"
            >
              <div className="relative bg-[#111] backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-[#181818] transition-all duration-500">
                {/* Photo with cinematic treatment */}
                <div className="relative h-72 overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover brightness-100 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/[0.05] to-white/[0.03] flex items-center justify-center group-hover:from-white/[0.03] group-hover:to-white/[0.05] transition-all duration-700">
                      <Users className="w-20 h-20 text-neutral-600 group-hover:text-neutral-500 transition-colors duration-300" />
                    </div>
                  )}
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5 text-center relative -mt-4">
                  <h3 className="text-lg font-bold font-heading text-white mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-brand-400 text-xs font-medium uppercase tracking-wide mb-0.5">
                    {member.role}
                  </p>
                  <p className="text-neutral-500 text-xs">{member.specialty}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </ScrollReveal>

        {/* Show more if > 3 members */}
        {members.length > 3 && (
          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
            {members.slice(3).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: (index + 3) * 0.2 }}
                onClick={() => setSelectedMember(member)}
                className="group cursor-pointer"
              >
                <div className="relative bg-[#111] backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-[#181818] transition-all duration-500">
                  <div className="relative h-72 overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover brightness-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/[0.05] to-white/[0.03] flex items-center justify-center group-hover:from-white/[0.03] group-hover:to-white/[0.05] transition-all duration-700">
                        <Users className="w-20 h-20 text-neutral-600 group-hover:text-neutral-500 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
                  </div>
                  <div className="p-5 text-center relative -mt-4">
                    <h3 className="text-lg font-bold font-heading text-white mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-brand-400 text-xs font-medium uppercase tracking-wide mb-0.5">
                      {member.role}
                    </p>
                    <p className="text-neutral-500 text-xs">{member.specialty}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </ScrollReveal>
        )}
      </div>

      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
