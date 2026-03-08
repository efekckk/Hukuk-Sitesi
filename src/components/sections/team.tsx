"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { User, Scale } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface TeamMemberData {
  name: string;
  role: string;
  specialty: string;
  image: string | null;
}

interface TeamProps {
  members?: TeamMemberData[];
}

export function Team({ members }: TeamProps) {
  const t = useTranslations("team");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 relative overflow-hidden">
      <Scale className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-white/[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="section-divider pt-4 text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members && members.length > 0
            ? members.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group bg-[#111111] rounded-2xl overflow-hidden group-hover:bg-[#181818] transition-all duration-500"
                >
                  <div className="relative h-56 bg-gradient-to-br from-white/[0.04] to-white/[0.06] flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <User className="w-20 h-20 text-neutral-400 group-hover:text-gray-400 transition-colors duration-500" />
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold font-heading text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-brand-400 text-sm font-medium uppercase tracking-wide mb-1">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {member.specialty}
                    </p>
                  </div>
                </motion.div>
              ))
            : [0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group bg-[#111111] rounded-2xl overflow-hidden group-hover:bg-[#181818] transition-all duration-500"
                >
                  <div className="relative h-56 bg-gradient-to-br from-white/[0.04] to-white/[0.06] flex items-center justify-center">
                    <User className="w-20 h-20 text-neutral-400 group-hover:text-gray-400 transition-colors duration-500" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold font-heading text-white mb-1">
                      {t(`members.${index}.name`)}
                    </h3>
                    <p className="text-brand-400 text-sm font-medium uppercase tracking-wide mb-1">
                      {t(`members.${index}.role`)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {t(`members.${index}.specialty`)}
                    </p>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
