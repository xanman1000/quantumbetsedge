import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ArrowUpRight, Zap, Loader2 } from "lucide-react";
import { useReturnPercentage } from "@/lib/googleSheetsAPI";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { returnPercentage, isLoading } = useReturnPercentage();
  
  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Binary code background pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-repeat text-green-500/20 text-[8px] font-mono leading-tight tracking-tighter overflow-hidden">
          {Array.from({ length: 50 }).map((_, rowIndex) => (
            <div key={rowIndex} className="whitespace-nowrap">
              {Array.from({ length: 200 }).map((_, colIndex) => (
                <span key={`${rowIndex}-${colIndex}`}>
                  {Math.random() > 0.1 ? (Math.random() > 0.5 ? '1' : '0') : '$'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphic background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-full h-1/3 bg-gradient-to-b from-purple-900/30 to-transparent"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/10 to-purple-500/10 blur-[120px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-radial from-orange-500/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
        
        {/* Bottom gradient for seamless blending */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
      </div>

      <div className="container px-4 pt-36 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl font-mono text-white/90 bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-purple-300 mb-4 block tracking-wide"
          >
            ELEVATE YOUR BETTING STRATEGY
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight"
          >
            QuantumBets
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-display text-white/90 mb-6"
          >
            AI-POWERED PRECISION PICKS
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto font-mono"
          >
            Our proprietary algorithm delivers exceptional ROI with a {' '}
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                loading...
              </span>
            ) : (
              <span className="text-green-400 font-bold">{returnPercentage}%</span>
            )}{' '}
            success rate across major sports.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl group">
                Get Access
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-8 justify-center items-center text-center mb-6"
          >
            <div className="flex items-center">
              <div className="bg-white/10 rounded-full p-2 mr-3">
                <Zap className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-white/70">24/7 AI analysis</span>
            </div>
            
            <div className="flex items-center">
              <div className="bg-white/10 rounded-full p-2 mr-3">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-white/70">Transparent pricing</span>
            </div>
            
            <div className="flex items-center">
              <div className="bg-white/10 rounded-full p-2 mr-3">
                <ArrowUpRight className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-white/70">Edge detection</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Section connector - blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-black to-black/70"></div>
    </section>
  );
};

export default HeroSection;
