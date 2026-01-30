import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import CalendarPreview from "@/components/home/CalendarPreview";
import ResourcesPreview from "@/components/home/ResourcesPreview";
import CTASection from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <NewsSection />
      <CalendarPreview />
      <ResourcesPreview />
      <CTASection />
    </Layout>
  );
}
