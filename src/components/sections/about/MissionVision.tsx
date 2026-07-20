import { Eye } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getHomepageSection } from "@/lib/content";
import { getLucideIcon } from "@/lib/lucideIconMap";

export async function MissionVision() {
  const [mission, vision] = await Promise.all([
    getHomepageSection("ABOUT_MISSION"),
    getHomepageSection("ABOUT_VISION"),
  ]);
  const MissionIcon = getLucideIcon(mission.icon);

  return (
    <section className="bg-soft-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-light-gray bg-white p-8 sm:p-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue/10 text-blue">
                <MissionIcon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 text-xl font-medium text-graphite sm:text-2xl">{mission.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-slate">{mission.statement}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-light-gray bg-white p-8 sm:p-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 text-xl font-medium text-graphite sm:text-2xl">{vision.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-slate">{vision.statement}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
