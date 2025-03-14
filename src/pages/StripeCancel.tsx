import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const StripeCancel = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-quantum-neutral to-quantum-secondary flex flex-col items-center justify-center px-4">
      <div className="bg-quantum-accent rounded-lg p-8 shadow-xl max-w-md w-full text-center">
        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-white mb-4">Uh-oh!</h1>
        
        <p className="text-xl text-white mb-6">
          That didn't work. Try again.
        </p>
        
        <p className="text-sm text-gray-300 mb-6">
          The payment process was cancelled or encountered an error. Don't worry, your account hasn't been charged.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => navigate("/")} 
            className="bg-quantum-primary hover:bg-quantum-primary/90 text-white"
          >
            Return Home ({countdown})
          </Button>
          
          <Button 
            onClick={() => navigate("/#pricing")} 
            variant="outline"
            className="border-quantum-primary text-quantum-primary hover:bg-quantum-primary/10"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StripeCancel; 