import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    id: "free",
    name: "Basic",
    price: "Free",
    period: "forever",
    description: "Start your betting journey",
    features: ["3 picks per day", "Email delivery only"],
    gradient: "from-gray-800 to-gray-900",
    hoverScale: 1.01,
    buttonStyle: "bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10",
    iconColor: "text-gray-400",
    checkColor: "text-gray-400",
  },
  {
    id: "daily",
    name: "Daily Pass",
    price: "$0.99",
    period: "one-time",
    description: "Buy today's top picks via Email & SMS",
    features: ["All picks for today", "SMS & Email delivery", "Instant notifications"],
    gradient: "from-blue-700 to-blue-900",
    hoverScale: 1.02,
    buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    glow: "shadow-sm shadow-blue-500/20",
    iconColor: "text-blue-400",
    checkColor: "text-blue-400",
  },
  {
    id: "weekly",
    name: "Locksmith",
    price: "$4.99",
    period: "per week",
    description: "Weekly access to all picks via Email & SMS",
    features: ["Full access to all picks", "SMS & Email delivery", "Instant alerts for hot picks"],
    gradient: "from-orange-600 to-purple-500",
    hoverScale: 1.03,
    buttonStyle: "bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white",
    glow: "shadow-md shadow-orange-500/30",
    iconColor: "text-orange-400",
    checkColor: "text-orange-400",
  },
  {
    id: "monthly",
    name: "Lockness Monster",
    price: "$17.99",
    period: "per month",
    description: "Complete access with premium SMS alerts",
    features: ["Best value for regular users", "Priority SMS & Email delivery", "Early access to picks", "VIP alert service"],
    popular: true,
    gradient: "from-purple-600 via-fuchsia-500 to-pink-500",
    hoverScale: 1.03,
    buttonStyle: "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-500 hover:via-fuchsia-400 hover:to-pink-400 text-white",
    glow: "shadow-lg shadow-purple-500/30",
    iconColor: "text-purple-400",
    checkColor: "text-purple-400",
    shine: true,
  },
];

const PricingSection = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectPlan = (tierId: string) => {
    // Store the selected plan in localStorage so it can be accessed during signup
    localStorage.setItem('selectedPlan', tierId);
    // Redirect to signup page
    navigate('/signup');
  };

  // Legacy function - keeping for reference if needed
  const handleFreeSubscription = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions/free`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your free subscription has been created. Check your email for more details!",
        });
        setIsDialogOpen(false);
        setEmail("");
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };
  
  const handlePaidSubscription = async () => {
    setIsSubmitting(true);
    try {
      // Set up communication preferences
      const preferences = {
        email,
        phone: smsConsent ? phone : null,
        smsConsent,
      };
      
      // Create checkout session
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier,
          preferences,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  // Phone number validation
  const validatePhoneNumber = (value: string) => {
    // US phone validation (simple version)
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits, spaces, dashes, and parentheses
    const sanitizedValue = value.replace(/[^\d\s\-()]/g, '');
    setPhone(sanitizedValue);
  };

  return (
    <section id="pricing" className="py-20 relative overflow-hidden bg-black">
      {/* Top gradient overlay for seamless transition */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/70 via-black/80 to-transparent z-10"></div>
      
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
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px]"></div>
        
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
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-md text-white/90 text-sm border border-white/10 mb-4">
            Flexible Plans
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include access to our proprietary AI algorithm.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group h-full flex"
            >
              <Card 
                className={`relative glassmorphism bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl overflow-hidden group-hover:shadow-lg group-hover:scale-${tier.hoverScale} flex flex-col w-full ${
                  tier.popular ? 'border-orange-500/50 shadow-lg shadow-orange-500/20' : ''
                } ${tier.glow || ''}`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg text-sm backdrop-blur-md">
                    Most Popular
                  </div>
                )}
                {tier.shine && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                )}
                <CardHeader className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <CardTitle className="text-2xl font-bold text-white relative z-10">{tier.name}</CardTitle>
                  <div className="mt-4 relative z-10">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-white/60">/{tier.period}</span>
                  </div>
                  <p className="text-white/70 mt-2 relative z-10 h-12">{tier.description}</p>
                </CardHeader>
                <CardContent className="relative flex-grow flex flex-col">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <ul className="space-y-4 relative z-10 mb-6 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center text-white/80 group-hover:text-white transition-colors">
                        <Check className={`h-5 w-5 ${tier.checkColor || 'text-orange-400'} mr-2 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-auto relative overflow-hidden ${tier.buttonStyle}`}
                    onClick={() => handleSelectPlan(tier.id)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Checkout dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-xl border-orange-900/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white mb-4">Complete Your Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                className="mt-1 bg-white/10 border-white/20 text-white" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sms-consent" 
                checked={smsConsent}
                onCheckedChange={(value) => setSmsConsent(value === true)}
                className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
              />
              <Label htmlFor="sms-consent" className="text-white">
                I want to receive SMS notifications
              </Label>
            </div>
            {smsConsent && (
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  className="mt-1 bg-white/10 border-white/20 text-white" 
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(123) 456-7890"
                />
                {phone && !validatePhoneNumber(phone) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid US phone number</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-orange-600 to-purple-600 text-white"
              onClick={handlePaidSubscription}
              disabled={isSubmitting || (smsConsent && phone && !validatePhoneNumber(phone))}
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bottom gradient overlay for seamless transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/90 via-black/80 to-transparent z-10"></div>
    </section>
  );
};

export default PricingSection;
