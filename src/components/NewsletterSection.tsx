
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail("");
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Winning Team
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Don't miss out on your chance to get data-driven sports betting picks. Join QuantumBets and take the first step towards smarter, more profitable betting.
          </p>
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email to get started..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" className="bg-quantum-primary hover:bg-quantum-primary/90">
                Get Started Today
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
