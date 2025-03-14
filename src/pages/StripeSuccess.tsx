import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const StripeSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Verify the session with the backend
    const verifySession = async () => {
      if (!sessionId) return;
      
      try {
        // Optional: Verify the session with your backend
        // await fetch(`${import.meta.env.VITE_API_URL}/api/verify-session/${sessionId}`);
      } catch (error) {
        console.error("Error verifying session:", error);
      }
    };

    verifySession();

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
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-quantum-neutral to-quantum-secondary flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-quantum-accent rounded-lg p-8 shadow-xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Success!</h1>
        
        <p className="text-xl text-white mb-6">
          Congrats! You're on your way to making $$$ with our state of the art model.
        </p>
        
        <p className="text-sm text-gray-300 mb-6">
          We've sent confirmation details to your email. You'll start receiving picks according to your subscription plan.
        </p>
        
        <Button 
          onClick={() => navigate("/")} 
          className="bg-quantum-primary hover:bg-quantum-primary/90 text-white w-full"
        >
          Return Home ({countdown})
        </Button>
      </motion.div>
    </div>
  );
};

export default StripeSuccess; 