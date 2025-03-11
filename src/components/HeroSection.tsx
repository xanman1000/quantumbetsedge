
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-quantum-primary/90 to-quantum-secondary/90">
      <div className="absolute inset-0 bg-[url('/stadium.jpg')] bg-cover bg-center opacity-20" />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
            Unlock Your Winning Edge with QuantumBets: AI-Powered Sports Betting Picks
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Get the top 10 daily betting picks, data-driven insights, and expert strategies to maximize your returns. Try it free for 3 days!
          </p>
          <Button size="lg" className="bg-white text-quantum-primary hover:bg-quantum-neutral">
            Start Your 3-Day Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
