import Layout from "@/components/layout/Layout";
import ExpandingHero from "@/components/home/ExpandingHero";
import StatsCounter from "@/components/home/StatsCounter";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import CalendarPreview from "@/components/home/CalendarPreview";
import ResourcesPreview from "@/components/home/ResourcesPreview";
import MembershipSection from "@/components/home/MembershipSection";
import WorkingGroupsSection from "@/components/home/WorkingGroupsSection";
import CTASection from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <ExpandingHero />
      <StatsCounter />
      <FeaturesSection />
      <NewsSection />
      <CalendarPreview />
      <MembershipSection />
      <ResourcesPreview />
      <WorkingGroupsSection />
      <CTASection />
    </Layout>
  );
}
