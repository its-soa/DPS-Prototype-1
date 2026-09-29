import { COURSES } from "@/lib/mock-data";

// Required for static export: pre-render one page per course.
export const dynamicParams = false;
export function generateStaticParams() {
  return COURSES.map((c) => ({ courseId: c.id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
