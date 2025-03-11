
import { TrendingUp, Brain, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    title: "Lifetime Returns",
    value: "+49%",
    description: "vs S&P 500 Last 6 Months",
    icon: TrendingUp,
  },
  {
    title: "AI Analysis",
    value: "24/7",
    description: "Algorithm-based Unit Risk Management",
    icon: Brain,
  },
  {
    title: "Real-time Updates",
    value: "Daily",
    description: "Data & Insights Every Single Day",
    icon: Clock,
  },
];

const PerformanceSection = () => {
  return (
    <section className="py-20 bg-quantum-neutral">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          AI Does the Heavy Lifting
        </h2>
        <p className="text-xl text-center text-white/80 mb-12">
          Data analysis and detailed research while you sleep. Nothing gets by our AI judge.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric) => (
            <Card key={metric.title} className="bg-quantum-secondary border-quantum-primary hover:border-quantum-primary/80 transition-colors">
              <CardContent className="p-6">
                <metric.icon className="h-12 w-12 text-quantum-primary mb-4" />
                <h3 className={`text-3xl font-bold mb-2 animate-number-count ${
                  metric.title === "Lifetime Returns" ? "text-green-500" : "text-quantum-primary"
                }`}>
                  {metric.value}
                </h3>
                <p className="text-lg font-semibold mb-1 text-white">{metric.title}</p>
                <p className="text-gray-400">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
