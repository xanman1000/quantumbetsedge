import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-black py-16 overflow-hidden">
      {/* Top gradient for seamless blending with previous section */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/70 via-black/90 to-black z-10"></div>
      
      {/* Glassmorphic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-purple-500/20 backdrop-blur-md mr-2">
                <span className="text-orange-400 text-xl font-bold">Q</span>
              </div>
              <h3 className="font-bold text-white text-xl">QuantumBets</h3>
            </div>
            <p className="text-white/70">
              AI-powered sports betting picks for smarter betting decisions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-white text-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white flex items-center transition-colors">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <Link to="/terms" className="text-white/70 hover:text-white flex items-center transition-colors">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-white flex items-center transition-colors">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-10 pt-8 text-center"
        >
          <p className="text-white/50">© {currentYear} QuantumBets. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
