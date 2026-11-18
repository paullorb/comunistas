/** @type {import('next').NextConfig} */
const nextConfig = {
  // Branded 404 for URLs that match no route (the root layout lives under [lang]).
  experimental: { globalNotFound: true },
  // Spanish is the default language and lives at the clean root; English is under /en.
  // Internally the routes are /es and /en (app/[lang]).
  async redirects() {
    return [{ source: "/es", destination: "/", permanent: true }];
  },
  async rewrites() {
    return [{ source: "/", destination: "/es" }];
  },
};

export default nextConfig;
