import Layout from "@/components/layout/Layout";
import ExpandingHero from "@/components/home/ExpandingHero";
import StatsCounter from "@/components/home/StatsCounter";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import CTASection from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <ExpandingHero />
      <StatsCounter />
      <FeaturesSection />
      <NewsSection />
      <CTASection />
    </Layout>
  );
}
