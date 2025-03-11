
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-quantum-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">QuantumBets</h3>
            <p className="text-white/80">
              AI-powered sports betting picks for smarter betting decisions.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white/80">About Us</a></li>
              <li><a href="#" className="hover:text-white/80">Contact</a></li>
              <li><a href="#" className="hover:text-white/80">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white/80">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white/80"><Facebook /></a>
              <a href="#" className="hover:text-white/80"><Twitter /></a>
              <a href="#" className="hover:text-white/80"><Instagram /></a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-white/80">
              Email: support@quantumbets.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p>© 2025 QuantumBets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
