import dynamic from "next/dynamic";
import { Hero } from "@/components/olly/sections/Hero";
import { SectionSkeleton } from "@/components/olly/SectionSkeleton";
import { Footer } from "@/components/olly/sections/Footer";

const PhoneAnimation = dynamic(
  () =>
    import("@/components/olly/sections/PhoneAnimation").then((m) => ({
      default: m.PhoneAnimation,
    })),
  { loading: () => <SectionSkeleton /> },
);

const AICoaches = dynamic(
  () =>
    import("@/components/olly/sections/AICoaches").then((m) => ({
      default: m.AICoaches,
    })),
  { loading: () => <SectionSkeleton /> },
);

const MomentOrbit = dynamic(
  () =>
    import("@/components/olly/sections/MomentOrbit").then((m) => ({
      default: m.MomentOrbit,
    })),
  { loading: () => <SectionSkeleton /> },
);

const Features = dynamic(
  () =>
    import("@/components/olly/sections/Features").then((m) => ({
      default: m.Features,
    })),
  { loading: () => <SectionSkeleton /> },
);

const HowItWorks = dynamic(
  () =>
    import("@/components/olly/sections/HowItWorks").then((m) => ({
      default: m.HowItWorks,
    })),
  { loading: () => <SectionSkeleton /> },
);

const Pricing = dynamic(
  () =>
    import("@/components/olly/sections/Pricing").then((m) => ({
      default: m.Pricing,
    })),
  { loading: () => <SectionSkeleton /> },
);

const FinalCTA = dynamic(
  () =>
    import("@/components/olly/sections/FinalCTA").then((m) => ({
      default: m.FinalCTA,
    })),
  { loading: () => <SectionSkeleton /> },
);

export default function OllyPage() {
  return (
    <main id="olly-main">
      <Hero />
      <PhoneAnimation />
      <AICoaches />
      <MomentOrbit />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
