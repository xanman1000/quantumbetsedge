import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  
  const validate = () => {
    const newErrors = {
      email: "",
      password: ""
    };
    
    let isValid = true;
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // In a real application, this would be an API call to authenticate the user
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // });
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to QuantumBets.",
      });
      
      // Navigate to account settings
      navigate("/account");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-radial from-orange-500/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/2 left-1/3 w-72 h-72 bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="flex items-center justify-center">
          <div className="p-2 rounded-full bg-orange-500/20 backdrop-blur-md mr-2">
            <Sparkles className="h-6 w-6 text-orange-400" />
          </div>
          <Link to="/" className="text-2xl font-bold text-white">QuantumBets</Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/70 text-sm">
              Sign in to access your AI-powered betting insights
            </p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus-visible:ring-orange-500"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus-visible:ring-orange-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            
            <div className="text-right">
              <a href="#" className="text-orange-400 hover:text-orange-300 text-sm">
                Forgot password?
              </a>
            </div>
          </div>
          
          <Button
            type="button"
            className="w-full mt-8 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : "Sign In"}
          </Button>
        </div>
        
        <p className="text-center text-white/50 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-400 hover:text-orange-300">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 