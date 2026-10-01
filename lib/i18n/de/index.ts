import type { en } from "../en";
import { common_de } from "./common";
import { exam_de } from "./exam";
import { learner_de } from "./learner";
import { onb_de } from "./onboarding";
import { pub_de } from "./public";
export const de: Record<keyof typeof en, string> = { ...common_de, ...pub_de, ...onb_de, ...learner_de, ...exam_de };
