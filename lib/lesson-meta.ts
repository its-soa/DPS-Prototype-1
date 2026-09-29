import { FileText, Headphones, Type, Video } from "lucide-react";
import type { LessonKind } from "./types";

export const KIND_META: Record<LessonKind, { label: string; Icon: typeof Headphones }> = {
  audio: { label: "Audio lesson", Icon: Headphones },
  video: { label: "Video lesson with audio description", Icon: Video },
  text: { label: "Text lesson", Icon: Type },
  pdf: { label: "PDF handbook", Icon: FileText },
};
