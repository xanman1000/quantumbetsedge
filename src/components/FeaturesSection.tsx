import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Activity, Target, Trophy, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-8 w-8 text-orange-400" />,
    title: "Advanced ML Algorithm",
    description: "Our proprietary machine learning algorithm analyzes thousands of data points in real-time for every game.",
    badge: "Core Tech"
  },
  {
    icon: <Activity className="h-8 w-8 text-purple-400" />,
    title: "Live Odds Tracking",
    description: "Real-time monitoring of line movements across major sportsbooks to identify market inefficiencies.",
    badge: "Real-time"
  },
  {
    icon: <Target className="h-8 w-8 text-orange-400" />,
    title: "Edge Detection",
    description: "Identifies high probability bets where our projected odds differ significantly from the market.",
    badge: "Precision"
  },
  {
    icon: <Trophy className="h-8 w-8 text-purple-400" />,
    title: "Performance History",
    description: "Full transparency with complete historical performance across all sports and bet types.",
    badge: "Transparency"
  },
  {
    icon: <Shield className="h-8 w-8 text-orange-400" />,
    title: "Bankroll Protection",
    description: "Intelligent stake sizing recommendations to optimize returns while minimizing risk.",
    badge: "Risk Management"
  },
  {
    icon: <Sparkles className="h-8 w-8 text-purple-400" />,
    title: "Premium Insights",
    description: "In-depth analysis and key factors influencing each pick, not just the prediction itself.",
    badge: "Premium"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 bg-black overflow-hidden">
      {/* Top gradient overlay for seamless transition */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/90 via-black/80 to-transparent z-10"></div>
      
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-radial from-orange-500/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/2 left-1/3 w-72 h-72 bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 tracking-tight">
            QUANTUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">FEATURES</span>
          </h2>
          <p className="text-xl text-white/70 font-mono">
            Our AI platform combines advanced algorithms, real-time data, and years of sports betting expertise to deliver exceptional results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="mb-5 relative">
                <div className="p-3 rounded-lg bg-black/30 inline-block">
                  {feature.icon}
                </div>
                <div className="absolute -top-4 -right-4">
                  <Badge variant="outline" className={`${index % 2 === 0 ? 'bg-orange-500/20 text-orange-300' : 'bg-purple-500/20 text-purple-300'} backdrop-blur-md border-white/10 font-mono text-xs tracking-wider`}>
                    {feature.badge}
                  </Badge>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white/90 font-display tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/60 group-hover:text-white/70 font-mono text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient overlay for seamless transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/90 via-black/80 to-transparent z-10"></div>
    </section>
  );
};

export default FeaturesSection; 