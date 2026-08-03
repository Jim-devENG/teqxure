import type { MetadataRoute } from "next";

const BASE_URL = "https://teqxure.xyz";

const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/studio", priority: 0.9 },
  { path: "/academy", priority: 0.9 },
  { path: "/community", priority: 0.8 },
  { path: "/research", priority: 0.7 },
  { path: "/about", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
