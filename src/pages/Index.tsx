
import HeroSection from "@/components/HeroSection";
import PerformanceSection from "@/components/PerformanceSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import NewsletterSection from "@/components/NewsletterSection";

const AboutSection = () => (
  <section className="py-20 bg-quantum-secondary">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
        What is QuantumBets?
      </h2>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xl text-gray-300">
          QuantumBets is an AI-powered sports picks service designed to give you the edge with cutting-edge insights. Our advanced algorithms analyze thousands of data points in real-time to provide you with the most accurate predictions and betting opportunities.
        </p>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-quantum-accent">
      <HeroSection />
      <PerformanceSection />
      <AboutSection />
      <PricingSection />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
