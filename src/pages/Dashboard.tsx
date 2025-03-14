import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { fetchROIPercentage } from "@/services/sheets";

const Dashboard = () => {
  const [roiPercentage, setRoiPercentage] = useState<string>('117.98');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadROI = async () => {
      try {
        setLoading(true);
        const percentage = await fetchROIPercentage();
        setRoiPercentage(percentage);
        console.log('ROI percentage loaded:', percentage);
      } catch (error) {
        console.error('Failed to load ROI:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadROI();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center mb-8">
          <div className="p-2 rounded-full bg-orange-500/20 backdrop-blur-md mr-3">
            <Sparkles className="h-6 w-6 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold">QuantumBets Dashboard</h1>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h2>
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <span className="text-green-400 font-bold">Lifetime ROI: </span>
                {loading ? (
                  <span className="flex items-center ml-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </span>
                ) : (
                  <span className="text-green-400 font-bold ml-2">{roiPercentage}%</span>
                )}
              </h3>
              <p className="text-white/70">
                Our proprietary algorithm delivers exceptional ROI with a proven track record across major sports.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Getting Started</h3>
                <p className="text-white/70 mb-4">Complete your profile and set your preferences to receive personalized betting recommendations.</p>
                <Button className="bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500">
                  Complete Setup
                </Button>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Latest Insights</h3>
                <p className="text-white/70 mb-4">No insights available yet. Subscribe to a plan to unlock AI-powered betting recommendations.</p>
                <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                  View Plans
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/" className="text-orange-400 hover:text-orange-300">
                Return to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 