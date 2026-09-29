"use client";

import { motion } from "framer-motion";
import { useReduceMotion } from "@/lib/use-motion";

/** Calm success mark: the check draws itself once, with a single soft pulse. No confetti. */
export function SuccessCheck() {
  const reduce = useReduceMotion();
  return (
    <motion.svg
      aria-hidden="true" viewBox="0 0 52 52" className="size-20 text-success"
      initial={reduce ? false : { scale: 0.96 }}
      animate={reduce ? undefined : { scale: [0.96, 1.04, 1] }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeWidth="3" />
      <motion.path
        d="M15 27 L23 35 L38 18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.8, delay: 0.25, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
