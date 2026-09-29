"use client";

import { useReducedMotion } from "framer-motion";
import { useApp } from "./store";

/** True when motion should be removed: the device setting OR the in-app setting. */
export function useReduceMotion() {
  const system = useReducedMotion();
  const { state } = useApp();
  return !!system || state.settings.reduceMotion;
}
