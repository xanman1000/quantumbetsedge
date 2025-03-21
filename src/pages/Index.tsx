import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PastWinningPicks from "@/components/PerformanceSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-quantum-accent">
      <Header />
      <HeroSection />
      <PastWinningPicks />
      <FeaturesSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Index;
