"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  style?: React.CSSProperties;
  staggerDelay?: number;
  yOffset?: number;
  duration?: number;
}

export function TextReveal({
  text,
  as: Tag = "h1",
  className = "",
  style,
  staggerDelay = 0.08,
  yOffset = 40,
  duration = 0.7,
}: TextRevealProps) {
  const lines = text.split("\n");
  const MotionTag = motion.create(Tag);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <MotionTag
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        return (
          <span key={lineIndex}>
            {words.map((word, wordIndex) => (
              <span
                key={`${lineIndex}-${wordIndex}`}
                className="relative overflow-hidden inline-block"
              >
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
                {wordIndex < words.length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            ))}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        );
      })}
    </MotionTag>
  );
}
