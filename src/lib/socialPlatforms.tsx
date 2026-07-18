import type { ComponentType } from "react";
import { FaXTwitter, FaLinkedin, FaGithub, FaInstagram, FaYoutube, FaTiktok, FaFacebook, FaDiscord } from "react-icons/fa6";
import { Globe } from "lucide-react";

export const SOCIAL_PLATFORMS = [
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "discord", label: "Discord" },
  { value: "website", label: "Website / Other" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

export const socialPlatformIcons: Record<string, ComponentType<{ className?: string }>> = {
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  facebook: FaFacebook,
  discord: FaDiscord,
  website: Globe,
};

export function getSocialLabel(platform: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.value === platform)?.label ?? platform;
}

/** Normalizes legacy `{ label, href }` social link records (pre-platform-picker)
 * into the current `{ platform, href }` shape, matching by label text. */
export function normalizeSocialLinks(
  raw: unknown,
): { platform: string; href: string }[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      if (typeof record.href !== "string") return null;

      if (typeof record.platform === "string") {
        return { platform: record.platform, href: record.href };
      }

      const label = typeof record.label === "string" ? record.label.toLowerCase() : "";
      const match = SOCIAL_PLATFORMS.find((p) => label.includes(p.value) || label.includes(p.label.toLowerCase()));
      return { platform: match?.value ?? "website", href: record.href };
    })
    .filter((v): v is { platform: string; href: string } => v !== null);
}
