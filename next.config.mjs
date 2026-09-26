/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // NOTE: Next.js App Router streams page data via inline scripts —
      // 'unsafe-inline' is REQUIRED or hydration silently fails (dead buttons).
      // React auto-escaping + no dangerouslySetInnerHTML keeps XSS risk low.
      // Future upgrade: per-request nonces via middleware (see SECURITY.md).
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'", // Tailwind + framer-motion runtime styles
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ");
    const out = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ];
    if (process.env.NODE_ENV === "production") {
      out.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
    }
    return [{ source: "/:path*", headers: out }];
  }
};
export default nextConfig;
