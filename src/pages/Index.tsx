import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
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
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roi, setRoi] = useState("68.7%"); // This would ideally come from an API

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Send the subscription request to your API
      await axios.post('/api/subscribe', { email });
      
      // Show success message
      toast({
        title: "Subscription successful!",
        description: "You've been added to our mailing list.",
      });
      
      // Clear form
      setEmail("");
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: "There was a problem with your subscription. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Subscription Form */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get the Quantum Edge in Sports Betting</h1>
              <p className="text-xl mb-6">Our AI-powered analytics have delivered a <span className="font-bold text-green-400">{roi} ROI</span> for our members this season.</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                <p className="font-semibold">✓ Daily expert picks with detailed analysis</p>
                <p className="font-semibold">✓ Advanced statistics most bettors miss</p>
                <p className="font-semibold">✓ Proven track record of beating the market</p>
              </div>
            </div>
            
            <div className="md:w-1/2 w-full">
              <div className="bg-white rounded-xl shadow-xl p-6">
                <h2 className="text-blue-900 text-2xl font-bold mb-4">Get Free Picks Delivered to Your Inbox</h2>
                <p className="text-gray-600 mb-4">Join thousands of sports bettors gaining an edge with our free picks newsletter.</p>
                
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Get Free Picks"}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    By subscribing, you agree to receive emails from QuantumBets. 
                    You can unsubscribe at any time.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Result Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-3 font-bold text-center">WIN</div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">NFL</span>
                  <span className="text-gray-500">Week 10</span>
                </div>
                <p className="font-semibold text-lg mb-2">Kansas City Chiefs -7.5</p>
                <p className="text-gray-600">Our AI identified value in this line as the Chiefs' offense was primed for a big performance against a depleted secondary.</p>
              </div>
            </div>
            
            {/* Result Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-3 font-bold text-center">WIN</div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">NFL</span>
                  <span className="text-gray-500">Week 10</span>
                </div>
                <p className="font-semibold text-lg mb-2">Dallas Cowboys ML</p>
                <p className="text-gray-600">Our quantitative models showed Dallas was significantly undervalued as home favorites despite their offensive efficiency metrics.</p>
              </div>
            </div>
            
            {/* Result Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-3 font-bold text-center">WIN</div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">NFL</span>
                  <span className="text-gray-500">Week 10</span>
                </div>
                <p className="font-semibold text-lg mb-2">BUF/DEN Under 49.5</p>
                <p className="text-gray-600">Weather conditions and defensive metrics strongly indicated this game would stay under the total.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <p className="font-semibold">John D.</p>
                  <p className="text-gray-500 text-sm">Member since 2022</p>
                </div>
              </div>
              <p className="text-gray-600">"I've tried several sports betting services before, but QuantumBets is on another level. The analysis provided with each pick helps me understand the logic behind it."</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  SM
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-gray-500 text-sm">Member since 2023</p>
                </div>
              </div>
              <p className="text-gray-600">"What I love most about QuantumBets is the transparency. They share both the wins and losses, and explain the reasoning behind each pick."</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  RJ
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Robert J.</p>
                  <p className="text-gray-500 text-sm">Member since 2023</p>
                </div>
              </div>
              <p className="text-gray-600">"After 3 months with QuantumBets, I'm up over 15 units. Their NFL picks have been especially profitable for me. Worth every penny."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get the Edge?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our community of winning bettors and start receiving our data-driven picks today.</p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white text-black"
                required
              />
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe Now"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">QuantumBets</h3>
              <p className="text-gray-400">AI-powered sports betting analytics for the modern bettor.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Subscription Plans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Results</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} QuantumBets. All rights reserved.</p>
            <p className="mt-2 text-xs">QuantumBets is an informational site. We do not accept wagers or provide gambling services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
