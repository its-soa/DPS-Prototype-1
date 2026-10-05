// BASE_PATH / STATIC_EXPORT are set only by the GitHub Pages workflow (static learner demo).
// Vercel and local dev run the normal Next.js server build, which the trainer portal needs because
// trainers create programs, lessons and quizzes (new ids) at runtime.
const basePath = process.env.BASE_PATH ?? "";
const staticExport = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(staticExport ? { output: "export" } : {}),
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};
export default nextConfig;
