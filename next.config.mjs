/** @type {import('next').NextConfig} */
const nextConfig = {
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
