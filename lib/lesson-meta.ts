import { FileText, Headphones, Type, Video } from "lucide-react";
import type { TKey } from "./i18n";
import type { LessonKind } from "./types";

export const KIND_META: Record<LessonKind, { labelKey: TKey; Icon: typeof Headphones }> = {
  audio: { labelKey: "kind.audio", Icon: Headphones },
  video: { labelKey: "kind.video", Icon: Video },
  text: { labelKey: "kind.text", Icon: Type },
  pdf: { labelKey: "kind.pdf", Icon: FileText },
};
