// Security headers for every response. The page is static, takes no input and embeds nothing, so
// the policy is tight: scripts and styles from this origin only (plus the Google Fonts stylesheet),
// no framing, no plugins, no forms posting elsewhere. 'unsafe-inline' stays because Next.js inlines
// its hydration data and the canvas/GSAP code sets inline styles; a nonce would force every request
// to render dynamically. Preview deployments additionally allow Vercel's comment toolbar.
const dev = process.env.NODE_ENV !== "production";
const preview = process.env.VERCEL_ENV === "preview";
const toolbar = preview ? " https://vercel.live" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${toolbar}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com${toolbar}`,
  `font-src 'self' https://fonts.gstatic.com${toolbar}`,
  `img-src 'self' data: blob:${toolbar}`,
  `connect-src 'self'${dev ? " ws:" : ""}${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${preview ? "https://vercel.live" : "'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Branded 404 for URLs that match no route (the root layout lives under [lang]).
  experimental: { globalNotFound: true },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
