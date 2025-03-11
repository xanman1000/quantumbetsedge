
import { TrendingUp, DollarSign, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    title: "Accuracy Rate",
    value: "92%",
    description: "Over the Last 90 Days",
    icon: TrendingUp,
  },
  {
    title: "Profits Generated",
    value: "$25,000+",
    description: "For Premium Subscribers",
    icon: DollarSign,
  },
  {
    title: "Daily Picks",
    value: "10",
    description: "Optimized for Your Success",
    icon: Target,
  },
];

const PerformanceSection = () => {
  return (
    <section className="py-20 bg-quantum-neutral">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Proven Results You Can Trust
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric) => (
            <Card key={metric.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <metric.icon className="h-12 w-12 text-quantum-primary mb-4" />
                <h3 className="text-3xl font-bold text-quantum-primary mb-2 animate-number-count">
                  {metric.value}
                </h3>
                <p className="text-lg font-semibold mb-1">{metric.title}</p>
                <p className="text-gray-600">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
