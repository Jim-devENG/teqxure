import type { SectionKey } from "@/lib/sectionSchemas";

export type PageGroupSlug = "home" | "about" | "academy" | "studio" | "community" | "research";

interface PageGroup {
  label: string;
  publicPath: string;
  adminBasePath: string;
  keys: SectionKey[];
}

/**
 * Which HomepageSection keys belong to which public page. Needed because a
 * single `homepageSection` table backs every marketing page — without this,
 * admin list queries and cache revalidation can't tell which rows are
 * "Home" vs. everything else (see the unfiltered `/admin/homepage` list this
 * config replaces). `academy`'s key list is intentionally a mix of
 * pre-existing bare keys (moved off Home) and new `ACADEMY_`-prefixed ones —
 * a `startsWith` prefix check can't express that, so every group is a plain
 * key list instead.
 */
export const PAGE_GROUPS: Record<PageGroupSlug, PageGroup> = {
  home: {
    label: "Home",
    publicPath: "/",
    adminBasePath: "/homepage",
    keys: ["HERO", "SOCIAL_PROOF", "WHY_PRODUCT_ENGINEERING", "PRODUCT_SHOWCASE_INTRO", "OFFERINGS_OVERVIEW", "HOME_CTA"],
  },
  about: {
    label: "About",
    publicPath: "/about",
    adminBasePath: "/about",
    keys: [
      "ABOUT_HERO",
      "ABOUT_STORY",
      "ABOUT_MISSION",
      "ABOUT_VISION",
      "ABOUT_STATS",
      "ABOUT_FOUNDER",
      "ABOUT_FAQ_INTRO",
      "ABOUT_SEO",
    ],
  },
  academy: {
    label: "Academy",
    publicPath: "/academy",
    adminBasePath: "/pages/academy",
    keys: [
      "ACADEMY_SEO",
      "ACADEMY_HERO",
      "FRAMEWORK_INTRO",
      "CURRICULUM_INTRO",
      "WHAT_YOULL_BUILD",
      "STUDENT_OUTCOMES",
      "INSTRUCTOR_PHILOSOPHY",
      "FAQ_INTRO",
      "FINAL_CTA",
    ],
  },
  studio: {
    label: "Studio",
    publicPath: "/studio",
    adminBasePath: "/pages/studio",
    keys: ["STUDIO_SEO", "STUDIO_HERO", "STUDIO_PROCESS", "STUDIO_PROOF", "STUDIO_CTA"],
  },
  community: {
    label: "Community",
    publicPath: "/community",
    adminBasePath: "/pages/community",
    keys: ["COMMUNITY_SEO", "COMMUNITY_HERO", "COMMUNITY_BENEFITS", "COMMUNITY_CTA"],
  },
  research: {
    label: "Research",
    publicPath: "/research",
    adminBasePath: "/pages/research",
    keys: ["RESEARCH_SEO", "RESEARCH_HERO", "RESEARCH_AREAS"],
  },
};

export function resolveSectionGroup(key: string): PageGroup {
  const group = (Object.values(PAGE_GROUPS) as PageGroup[]).find((g) => (g.keys as string[]).includes(key));
  return group ?? PAGE_GROUPS.home;
}
