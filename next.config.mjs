// BASE_PATH is set by the GitHub Pages workflow (e.g. "/DPS-Prototype-1"); empty for local dev.
const basePath = process.env.BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // static site: everything runs client-side on mock data
  trailingSlash: true, // /dashboard/ -> dashboard/index.html, so deep links work on GitHub Pages
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};
export default nextConfig;
