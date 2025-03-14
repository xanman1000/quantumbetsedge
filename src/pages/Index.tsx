import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PastWinningPicks from "@/components/PerformanceSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-quantum-accent">
      <Header />
      <HeroSection />
      <PastWinningPicks />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
