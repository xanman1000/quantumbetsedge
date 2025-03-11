
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Basic",
    price: "Free",
    period: "forever",
    description: "Start your betting journey",
    features: [
      "Limited daily picks",
      "Basic analytics dashboard",
      "Email notifications",
    ],
  },
  {
    name: "Daily Pass",
    price: "$0.99",
    period: "per day",
    description: "Buy today's top picks",
    features: [
      "All picks for today",
      "Detailed analysis",
      "24-hour support",
    ],
  },
  {
    name: "Locksmith",
    price: "$5.99",
    period: "per week",
    description: "Unlock consistent profits",
    features: [
      "Weekly access to all picks",
      "Premium analytics",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Lockness Monster",
    price: "$19.99",
    period: "per month",
    description: "Maximum profit potential",
    features: [
      "Unlimited access to all picks",
      "Advanced AI insights",
      "VIP support & community",
    ],
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-quantum-accent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          Choose Your Winning Plan
        </h2>
        <p className="text-xl text-center text-white/80 mb-12">
          Start with a free trial and upgrade anytime
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative bg-quantum-secondary border-quantum-neutral hover:border-quantum-primary transition-colors ${
                tier.popular ? 'border-quantum-primary shadow-lg shadow-quantum-primary/20' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-quantum-primary text-white px-4 py-1 rounded-bl-lg text-sm">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-quantum-primary">{tier.price}</span>
                  <span className="text-gray-400">/{tier.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center text-white">
                      <Check className="h-5 w-5 text-quantum-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 ${
                    tier.popular 
                      ? 'bg-quantum-primary hover:bg-quantum-primary/90 text-white' 
                      : 'bg-quantum-neutral hover:bg-quantum-neutral/90 text-white'
                  }`}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
