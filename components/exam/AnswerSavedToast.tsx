"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useReduceMotion } from "@/lib/use-motion";

/**
 * Visual confirmation only. The spoken confirmation is sent through the
 * persistent live region (useAnnouncer) so it is never announced twice.
 */
export function AnswerSavedToast({ show, message }: { show: boolean; message: string }) {
  const reduce = useReduceMotion();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="pointer-events-none fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl border-2 border-success bg-success-soft px-5 py-4 text-lg font-bold text-success shadow-lg"
        >
          <CheckCircle2 className="size-6" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
