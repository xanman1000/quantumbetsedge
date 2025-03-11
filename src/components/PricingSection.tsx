
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Beginner's Luck",
    price: "Free",
    period: "forever",
    description: "Perfect for beginners looking to test our platform",
    features: [
      "Get 3 daily betting picks",
      "Basic analytics",
      "Email delivery",
    ],
  },
  {
    name: "Serious Enthusiast",
    price: "$6.99",
    period: "per week",
    description: "Most popular plan for serious enthusiasts",
    features: [
      "Get 7 daily betting picks",
      "Enhanced analytics",
      "Priority email delivery",
    ],
    popular: true,
  },
  {
    name: "Professional User",
    price: "$12.99",
    period: "per week",
    description: "Maximum insights for the professional user",
    features: [
      "Full access - Get all 10 Daily betting picks!",
      "Mobile Access",
      "Priority Chat and support",
    ],
  },
];

const PricingSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Unlock Your Winning Strategy
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Choose the plan that best fits your betting style
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative ${tier.popular ? 'border-quantum-primary shadow-lg' : ''}`}>
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-quantum-primary text-white px-4 py-1 rounded-bl-lg text-sm">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-gray-600">/{tier.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-quantum-secondary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 ${
                    tier.popular ? 'bg-quantum-primary hover:bg-quantum-primary/90' : ''
                  }`}
                  variant={tier.popular ? 'default' : 'outline'}
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
