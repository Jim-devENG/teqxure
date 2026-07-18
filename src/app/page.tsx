import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { WhyProductEngineering } from "@/components/sections/WhyProductEngineering";
import { Framework } from "@/components/sections/Framework";
import { Curriculum } from "@/components/sections/Curriculum";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { WhatYoullBuild } from "@/components/sections/WhatYoullBuild";
import { StudentOutcomes } from "@/components/sections/StudentOutcomes";
import { InstructorPhilosophy } from "@/components/sections/InstructorPhilosophy";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <WhyProductEngineering />
      <Framework />
      <Curriculum />
      <ProductShowcase />
      <WhatYoullBuild />
      <StudentOutcomes />
      <InstructorPhilosophy />
      <FAQ />
      <FinalCTA />
    </>
  );
}
