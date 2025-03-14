import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Eye, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  BarChart3, 
  CircleDollarSign, 
  Zap,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { newsletterApi } from "@/services/api";

// Custom sports icons with proper prop handling
interface IconProps {
  className?: string;
}

const BasketballIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className || ""}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M4.93 4.93c4.5 4.5 10.6 4.5 15.14 0" />
    <path d="M4.93 19.07c4.5-4.5 10.6-4.5 15.14 0" />
    <path d="M2 12h20" />
    <path d="M12 2v20" />
  </svg>
);

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [sampleNewsletter, setSampleNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch sample newsletter on component mount
  useEffect(() => {
    const fetchSampleNewsletter = async () => {
      try {
        setLoading(true);
        const response = await newsletterApi.getLatestNewsletter(false);
        if (response.success && response.data) {
          setSampleNewsletter(response.data);
        }
      } catch (error) {
        console.error("Error fetching sample newsletter:", error);
        // Fallback to static content if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchSampleNewsletter();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email to subscribe.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      // Store the email in localStorage so it can be pre-filled on the signup page
      localStorage.setItem('subscriberEmail', email);
      
      // Start the subscription process - this will be completed on signup
      await newsletterApi.subscribe(email, "", "", "FREE");
      
      // Navigate to signup page
      navigate('/signup');
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription Error",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-black">
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              Stay <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">One Step Ahead</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto font-mono">
              Subscribe to our exclusive insights and updates. Be the first to receive new strategies, betting tips, and special promotions direct to your inbox.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
              <Input
                type="email"
                placeholder="Enter your email to get started..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white focus:border-purple-500 focus:ring-purple-500/20"
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg transition-all duration-300"
              >
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <div className="mt-4 flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full font-medium px-6 py-2 text-white border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-md mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    View Sample Newsletter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-black/90 border-gray-800 text-white backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">
                      {loading ? (
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Loading sample...
                        </div>
                      ) : (
                        sampleNewsletter?.title || "Today's Betting Spotlight: Unleash the Value!"
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Sample of our premium daily betting content
                    </DialogDescription>
                  </DialogHeader>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-500" />
                      <p className="text-gray-400">Loading latest content...</p>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {sampleNewsletter ? (
                        <div dangerouslySetInnerHTML={{ __html: sampleNewsletter.htmlContent }} />
                      ) : (
                        /* Fallback static content */
                        <>
                          <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                            <Trophy className="h-5 w-5 mr-2 text-orange-400" />
                            Today's Picks at a Glance
                          </h3>
                          
                          <ul className="space-y-1 mt-2 mb-4">
                            <li className="flex justify-between">
                              <span>Mets ML vs. Red Sox</span>
                              <span className="text-green-500">3 units • -105</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Lightning vs. Flyers Over 6.5</span>
                              <span className="text-green-500">2 units • -110</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Chiefs -7 vs. Broncos</span>
                              <span className="text-green-500">4 units • -115</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Lakers +3.5 vs. Nuggets</span>
                              <span className="text-green-500">2 units • -108</span>
                            </li>
                          </ul>
                          
                          <h3 className="text-lg font-semibold text-purple-400 flex items-center mt-6">
                            <Flame className="h-5 w-5 mr-2 text-orange-400" />
                            Detailed Analysis: Mets vs. Red Sox
                          </h3>
                          
                          <p className="text-gray-300 text-sm">
                            Our quantum models have identified substantial value on the Mets moneyline today. 
                            The Sox are sending their #4 starter to the mound, who's been struggling with 
                            a 5.67 ERA over his last 7 starts. 
                            Meanwhile, the Mets' offense has been heating up, batting .278 collectively 
                            over the past week with an .820 OPS.
                          </p>
                          
                          <div className="bg-purple-500/10 rounded-lg p-3 my-4 border border-purple-500/20">
                            <h4 className="text-white flex items-center text-sm font-semibold">
                              <TrendingUp className="h-4 w-4 mr-1 text-purple-400" />
                              Edge Analysis
                            </h4>
                            <p className="text-xs text-gray-300 mt-1">
                              Our model gives the Mets a 58.2% win probability, meaning the fair odds should be -139. 
                              At the current -105 line, this represents a solid 6.8% edge.
                            </p>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-purple-400 flex items-center mt-6">
                            <Target className="h-5 w-5 mr-2 text-orange-400" />
                            Player Prop Special: Patrick Mahomes
                          </h3>
                          
                          <p className="text-gray-300 text-sm">
                            We've identified an exploitable pattern in Mahomes' totals that the market hasn't adjusted for.
                            In dome games against bottom-10 pass defenses, Mahomes has gone over 285.5 passing yards in 9 of his last 11 starts.
                            Today's line is set at 278.5 yards, presenting clear value.
                          </p>
                          
                          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-lg p-3 my-4 border border-orange-500/20">
                            <p className="text-orange-300 text-sm font-semibold">
                              Remember: These picks are only a taste of what our full subscribers receive daily. 
                              Premium subscribers get 15-20 picks weekly, complete with detailed analysis, 
                              model projections, and live betting alerts.
                            </p>
                          </div>
                          
                          <p className="text-gray-300 text-sm">
                            <strong className="text-orange-400">Don't wait!</strong> These lines are moving quickly as sharps are already on them.
                            Subscribe now for full access before these edges disappear.
                          </p>
                          
                          <p className="text-xs text-gray-500 mt-4">
                            Note: All picks come with our recommendation for responsible bankroll management.
                            Never bet more than you can afford to lose.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6 flex flex-col space-y-2">
                    <Button 
                      className="bg-gradient-to-r from-orange-600 to-purple-500 hover:from-orange-700 hover:to-purple-600 rounded-full transition-all duration-300 shadow-lg shadow-purple-900/20"
                      onClick={() => navigate('/signup')}
                    >
                      Subscribe Now for Full Access
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <p className="text-center text-sm text-gray-400">
                      Already subscribed? <Link to="/newsletter-archive" className="text-purple-400 hover:text-purple-300">Access the archive here</Link>
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-center mt-6 text-white/50 text-sm">
              Already a subscriber? <a href="/newsletter-archive" className="text-purple-400 hover:text-purple-300">Access Newsletter Archive</a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
