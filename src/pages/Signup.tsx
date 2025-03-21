import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Sparkles } from "lucide-react";

const Signup = () => {
  const { toast } = useToast();
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  
  const bets = [
    { id: "bet1", name: "NFL - Chiefs vs. Ravens", prediction: "Chiefs -3.5", confidence: 72 },
    { id: "bet2", name: "NBA - Lakers vs. Celtics", prediction: "Over 218.5", confidence: 68 },
    { id: "bet3", name: "MLB - Yankees vs. Red Sox", prediction: "Yankees ML", confidence: 65 },
  ];
  
  const handleBetClick = (betId: string) => {
    setSelectedBet(betId);
    toast({
      title: "Sample Bet Selected",
      description: "This is a demo sample prediction.",
    });
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-radial from-orange-500/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/2 left-1/3 w-72 h-72 bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="flex items-center justify-center">
          <div className="p-2 rounded-full bg-orange-500/20 backdrop-blur-md mr-2">
            <Sparkles className="h-6 w-6 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">QuantumBets</h1>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Quantum-Powered Predictions
            </h2>
            <p className="text-white/70 text-sm">
              Our AI analyzes millions of data points to give you the edge
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {bets.map((bet) => (
              <div 
                key={bet.id} 
                onClick={() => handleBetClick(bet.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedBet === bet.id 
                    ? 'bg-white/20 border-orange-500/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">{bet.name}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    bet.confidence > 70 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {bet.confidence}% Confidence
                  </div>
                </div>
                <p className="text-white/80 font-semibold">{bet.prediction}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6 text-sm text-white/80">
            <div className="flex items-start space-x-2">
              <BookOpen className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <p className="font-medium text-white">How it works</p>
                <p className="mt-1">
                  Our quantum computing algorithm analyzes historical data, trends, and key metrics to identify high-value betting opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-white/50 text-xs space-y-2">
          <p>
            For informational purposes only. QuantumBets does not accept wagers.
          </p>
          <p>
            <Link to="/terms" className="text-orange-400 hover:text-orange-300">Terms</Link> · 
            <Link to="/privacy" className="text-orange-400 hover:text-orange-300 ml-2">Privacy</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup; 