import { Check, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Sample data for past winning picks
const winningPicks = [
  {
    title: "Mavs Moneyline",
    odds: "+200",
    profit: "+6u",
    sport: "NBA",
    icon: Trophy,
    gradient: "from-orange-500 to-purple-500",
  },
  {
    title: "Cade Cunningham o5.5 Reb",
    odds: "-110",
    profit: "+1u",
    sport: "NBA",
    icon: TrendingUp,
    gradient: "from-purple-500 to-orange-500",
  },
  {
    title: "Minnesota Wild +1.5",
    odds: "-150",
    profit: "+1u",
    sport: "NHL",
    icon: Check,
    gradient: "from-orange-500 to-purple-500",
  },
];

const PastWinningPicks = () => {
  return (
    <section id="performance" className="py-20 bg-black relative overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/2 left-1/3 w-72 h-72 bg-gradient-radial from-orange-500/5 to-transparent rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-white">
            Proven <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">Results in Action</span>
          </h2>
          <p className="text-xl text-center text-white/80 max-w-2xl mx-auto">
            Here's tangible proof of our AI's effectiveness — real picks that delivered real profits. No theories, just results.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {winningPicks.map((pick, index) => (
            <motion.div
              key={pick.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="glassmorphism bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 shadow-xl group-hover:shadow-purple-500/10 overflow-hidden">
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Background glow */}
                  <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${pick.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                        {pick.sport}
                      </Badge>
                      <div className={`p-2 rounded-full bg-gradient-to-br ${pick.gradient} bg-opacity-20 backdrop-blur-md shadow-lg`}>
                        <pick.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-5 text-white">
                      {pick.title}
                    </h3>
                    
                    <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/10">
                      <div className="flex items-center">
                        <span className="text-white/70 mr-2">Odds:</span>
                        <span className="text-white font-medium">{pick.odds}</span>
                      </div>
                      <div className="font-bold text-xl text-green-400">
                        {pick.profit}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient overlay for seamless transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/90 via-black/80 to-transparent z-10"></div>
    </section>
  );
};

export default PastWinningPicks;
