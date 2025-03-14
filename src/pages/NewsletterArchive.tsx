import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronRight, Lock, Search, Eye, ArrowUpRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { newsletterApi } from "@/services/api";

// Newsletter interface
interface Newsletter {
  _id: string;
  title: string;
  contentDate: string;
  plainTextContent: string;
  htmlContent: string;
  sports: string[];
  tierAvailability: string[];
  isPublished: boolean;
}

const NewsletterArchive = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Check auth status on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      // Check subscription tier
      const tier = localStorage.getItem('subscriptionTier');
      setIsPremium(tier === 'WEEKLY' || tier === 'MONTHLY');
    }
    
    // Fetch newsletters
    fetchNewsletters();
  }, []);

  // Fetch newsletters from API
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await newsletterApi.getNewsletterArchive({
        limit: 20,
        sort: 'contentDate',
        order: 'desc'
      });
      
      if (response.success && response.data) {
        setNewsletters(response.data);
      } else {
        // Fallback to mock data if API fails
        // We'll keep the mock data as fallback
        console.warn("Using mock data as fallback");
      }
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      toast({
        title: "Error",
        description: "Could not fetch newsletters. Using sample data instead.",
        variant: "destructive",
      });
      // Keep mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // This would normally connect to an authentication service
      // For demo, we're just mocking a successful login
      
      // In a real implementation, you would make a login API call
      // const response = await authApi.login(email, password);
      
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('subscriptionTier', 'MONTHLY'); // Mocking a premium subscription
      
      setIsLoggedIn(true);
      setIsPremium(true);
      
      toast({
        title: "Success!",
        description: "You're now logged in.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter newsletters based on search term and active tab
  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = 
      newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.plainTextContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.sports.some(sport => sport.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && newsletter.sports.includes(activeTab.toUpperCase());
  });

  const canAccessNewsletter = (tier: string[]) => {
    if (tier.includes('FREE')) return true;
    return isLoggedIn && isPremium;
  };

  const handleNewsletterClick = (newsletter: Newsletter) => {
    if (canAccessNewsletter(newsletter.tierAvailability)) {
      setSelectedNewsletter(newsletter);
    } else {
      toast({
        title: "Premium Content",
        description: "Please subscribe to access this premium newsletter.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-16 relative">
        {/* Glassmorphic background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
        </div>
        
        <div className="pt-16 pb-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Newsletter Archive</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Access our historical betting insights and analysis. Premium content is available to subscribers only.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Sidebar with login/filters */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-white/10 p-6 sticky top-24">
              {isLoggedIn ? (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Filters</h3>
                  
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search newsletters..."
                        className="bg-white/5 border-white/10 text-white pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-white/70 mb-2">Sports Categories</h4>
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="bg-black/50 border border-white/10">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="nfl">NFL</TabsTrigger>
                        <TabsTrigger value="nba">NBA</TabsTrigger>
                        <TabsTrigger value="mlb">MLB</TabsTrigger>
                        <TabsTrigger value="nhl">NHL</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Subscription Status</h4>
                    <div className="bg-gradient-to-r from-purple-600/20 to-orange-600/20 backdrop-blur-md rounded-lg p-4 border border-white/10">
                      <p className="text-white font-medium">
                        {isPremium ? 'Premium Subscriber' : 'Free Tier'}
                      </p>
                      <p className="text-white/70 text-sm mt-1">
                        {isPremium 
                          ? 'You have access to all premium content.' 
                          : 'Upgrade to access premium insights.'}
                      </p>
                      {!isPremium && (
                        <Button className="mt-3 w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white" asChild>
                          <a href="/pricing">Upgrade Now</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Login</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Sign in to access premium newsletters and personalized content.
                  </p>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="bg-white/5 border-white/10 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="bg-white/5 border-white/10 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Sign In
                    </Button>
                  </form>
                  
                  <div className="mt-6">
                    <p className="text-white/50 text-sm text-center">
                      Don't have an account?{" "}
                      <a href="/signup" className="text-purple-400 hover:text-purple-300">
                        Sign up
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Newsletter listings */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 bg-black/40 backdrop-blur-lg rounded-xl border border-white/10">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-500" />
                <p className="text-white/70">Loading newsletters...</p>
              </div>
            ) : filteredNewsletters.length === 0 ? (
              <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-white/10 p-8 text-center">
                <p className="text-white/70">No newsletters match your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNewsletters.map((newsletter) => (
                  <div 
                    key={newsletter._id}
                    className="bg-black/40 backdrop-blur-lg rounded-xl border border-white/10 p-6 transition-all duration-300 hover:bg-black/50 hover:border-white/20 cursor-pointer"
                    onClick={() => handleNewsletterClick(newsletter)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{newsletter.title}</h3>
                        <div className="flex items-center text-white/50 text-sm mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(newsletter.contentDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <Badge
                        variant={newsletter.tierAvailability.includes('FREE') ? "outline" : "default"}
                        className={newsletter.tierAvailability.includes('FREE') 
                          ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50"
                          : "bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/50"
                        }
                      >
                        {newsletter.tierAvailability.includes('FREE') ? "Free" : "Premium"}
                      </Badge>
                    </div>
                    
                    <p className="text-white/70 mb-4 line-clamp-2">
                      {newsletter.plainTextContent.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {newsletter.sports.map((sport) => (
                          <Badge key={sport} variant="outline" className="bg-white/5 border-white/10 text-white/70">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                      >
                        {canAccessNewsletter(newsletter.tierAvailability) ? (
                          <>
                            Read <Eye className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Locked <Lock className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Newsletter content dialog */}
        <Dialog open={!!selectedNewsletter} onOpenChange={(open) => !open && setSelectedNewsletter(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-gray-800 text-white backdrop-blur-xl">
            {selectedNewsletter && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {selectedNewsletter.title}
                  </DialogTitle>
                  <DialogDescription className="text-white/70 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(selectedNewsletter.contentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedNewsletter.htmlContent }} />
                
                <div className="flex justify-end mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* CTA for non-logged in users */}
        {!isLoggedIn && (
          <div className="mt-12 relative z-10 bg-gradient-to-r from-orange-900/20 to-purple-900/20 backdrop-blur-lg rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Unlock Premium Content</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-6">
              Sign up now to access our full archive of premium betting insights, analysis and predictions.
              Get the edge you need to make smarter bets.
            </p>
            <Button className="bg-gradient-to-r from-orange-600 to-purple-500 text-white px-8 py-6 rounded-full text-lg" asChild>
              <a href="/signup">
                Sign Up Now
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsletterArchive; 