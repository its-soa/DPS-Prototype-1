import { EXAM_QUESTIONS } from "@/lib/mock-data";

export const dynamicParams = false;
export function generateStaticParams() {
  return EXAM_QUESTIONS.map((_, i) => ({ n: String(i + 1) }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
