"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, User } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string | null;
}

interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export function TeamMemberModal({ member, onClose }: TeamMemberModalProps) {
  const isOpen = member !== null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Subtle glow behind modal */}
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-3xl blur-2xl" />

            <div className="relative bg-[#111111] rounded-2xl border border-white/[0.06] overflow-hidden">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 rounded-full p-2 bg-white/[0.06] text-neutral-400 hover:text-white border border-white/[0.08] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="relative h-72 bg-gradient-to-br from-white/[0.04] to-white/[0.06] flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-24 h-24 text-white/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="p-8 -mt-8 relative z-10">
                <h2 className="text-2xl font-bold font-heading text-white mb-1">
                  {member.name}
                </h2>
                <p className="text-brand-400 text-sm font-medium uppercase tracking-wide mb-2">
                  {member.role}
                </p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-brand-500 to-brand-400 mb-4 rounded-full" />
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {member.specialty}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
