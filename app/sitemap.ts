import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [{ url: base, lastModified: new Date() }, { url: `${base}/shop`, lastModified: new Date() }, { url: `${base}/about`, lastModified: new Date() }, { url: `${base}/contact`, lastModified: new Date() }, { url: `${base}/wholesale`, lastModified: new Date() }];
}
