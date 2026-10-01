import { common } from "./common";
import { exam } from "./exam";
import { learner } from "./learner";
import { onb } from "./onboarding";
import { pub } from "./public";
export const en = { ...common, ...pub, ...onb, ...learner, ...exam } as const;
