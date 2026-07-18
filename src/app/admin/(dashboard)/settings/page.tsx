import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { normalizeSocialLinks } from "@/lib/socialPlatforms";

export default async function SettingsPage() {
  const settings = await db.siteSettings.findFirst();

  const defaults = {
    siteName: settings?.siteName ?? "Teqxure",
    tagline: settings?.tagline ?? "",
    contactEmail: settings?.contactEmail ?? "",
    notificationEmail: settings?.notificationEmail ?? "",
    seoTitle: settings?.seoTitle ?? "",
    seoDescription: settings?.seoDescription ?? "",
    socialLinks: normalizeSocialLinks(settings?.socialLinks),
  };

  return (
    <div>
      <PageHeader title="Settings" description="Brand, SEO defaults, and social links." />
      <SettingsForm defaults={defaults} />
    </div>
  );
}
