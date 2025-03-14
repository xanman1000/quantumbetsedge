import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Terms and consents
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(false);
  const [ageVerification, setAgeVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: ""
  });
  
  const validateStep1 = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: ""
    };
    
    let isValid = true;
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    
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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateStep2 = () => {
    const newErrors = { ...errors, terms: "" };
    let isValid = true;
    
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the Terms of Service and Privacy Policy";
      isValid = false;
    }
    
    if (!ageVerification) {
      newErrors.terms = newErrors.terms || "You must confirm you are of legal age";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSignup();
    }
  };
  
  const handleSignup = async () => {
    setLoading(true);
    
    try {
      // In a real application, this would be an API call to register the user
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     username,
      //     email,
      //     password,
      //     agreeUpdates,
      //   }),
      // });
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to QuantumBets. You can now set up your preferences.",
      });
      
      // Navigate to account settings
      navigate("/account");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
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
          <h1 className="text-2xl font-bold text-white">QuantumBets</h1>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === 1 ? "Create Your Account" : "Confirm & Proceed"}
            </h2>
            <p className="text-white/70 text-sm">
              {step === 1 
                ? "Join QuantumBets for AI-powered betting analysis" 
                : "Please review and accept our terms to continue"}
            </p>
          </div>
          
          {step === 1 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus-visible:ring-orange-500"
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>
              
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
                    placeholder="Create a password"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus-visible:ring-orange-500"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/10 border transition-colors ${!agreeTerms && errors.terms ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                  <CustomCheckbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="terms" className="text-sm text-white cursor-pointer flex items-center">
                      I agree to the <Link to="/terms" className="text-orange-400 hover:text-orange-300 mx-1">Terms of Service</Link> and <Link to="/privacy" className="text-orange-400 hover:text-orange-300 mx-1">Privacy Policy</Link>
                      <span className="ml-1 text-red-400 text-xs">*</span>
                    </Label>
                    <p className="text-white/50 text-xs mt-1">Required</p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/10 border transition-colors ${!ageVerification && errors.terms ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                  <CustomCheckbox 
                    id="ageVerification" 
                    checked={ageVerification}
                    onCheckedChange={(checked) => setAgeVerification(checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="ageVerification" className="text-sm text-white cursor-pointer flex items-center">
                      I confirm I am of legal age to use sports betting services in my jurisdiction
                      <span className="ml-1 text-red-400 text-xs">*</span>
                    </Label>
                    <p className="text-white/50 text-xs mt-1">Required</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-white/10 border border-white/10 transition-colors">
                  <CustomCheckbox 
                    id="updates" 
                    checked={agreeUpdates}
                    onCheckedChange={(checked) => setAgreeUpdates(checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="updates" className="text-sm text-white cursor-pointer">
                      I want to receive updates about picks, promotions, and new features
                    </Label>
                    <p className="text-white/50 text-xs mt-1">Optional</p>
                  </div>
                </div>
                
                {errors.terms && <p className="text-red-500 text-xs mt-2 px-2">{errors.terms}</p>}
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-xs text-white/70">
                <p>
                  QuantumBets does not directly accept bets or wagers. We provide predictions and analysis for informational purposes only. 
                  Users should ensure they comply with all applicable laws in their jurisdiction.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-8">
            {step === 2 && (
              <Button
                type="button"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              className={`${step === 1 ? "ml-auto" : ""} bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white`}
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : step === 1 ? "Continue" : "Create Account"}
            </Button>
          </div>
        </div>
        
        <p className="text-center text-white/50 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-orange-400 hover:text-orange-300">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup; 