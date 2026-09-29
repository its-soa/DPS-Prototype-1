import { LESSONS } from "@/lib/mock-data";

export const dynamicParams = false;
export function generateStaticParams({ params }: { params: { courseId: string } }) {
  return LESSONS.filter((l) => l.courseId === params.courseId).map((l) => ({ lessonId: l.id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
