import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>Welcome to QuantumBets. By accessing or using our service, you agree to these terms. Please read them carefully.</p>
          
          <h2>2. Disclaimer</h2>
          <p>QuantumBets is an informational service only. We do not accept bets or wagers. All predictions and analyses are for entertainment purposes only.</p>
          
          <h2>3. No Gambling Services</h2>
          <p>We explicitly state that:</p>
          <ul>
            <li>We do not operate as a gambling service</li>
            <li>We do not accept or process any bets or wagers</li>
            <li>We do not guarantee any outcomes</li>
            <li>All predictions are speculative and should not be the sole basis for any betting decisions</li>
          </ul>
          
          <h2>4. User Responsibilities</h2>
          <p>Users must:</p>
          <ul>
            <li>Be of legal age in their jurisdiction</li>
            <li>Comply with all local laws regarding sports betting</li>
            <li>Use the information responsibly</li>
            <li>Not rely solely on our predictions for betting decisions</li>
          </ul>
          
          <h2>5. Legal Compliance</h2>
          <p>Users are responsible for ensuring their use of our service complies with all applicable laws in their jurisdiction. We make no representations about the legality of sports betting in any jurisdiction.</p>
          
          <h2>6. Limitation of Liability</h2>
          <p>QuantumBets and its operators:</p>
          <ul>
            <li>Are not liable for any losses incurred from using our predictions</li>
            <li>Do not guarantee the accuracy of any information provided</li>
            <li>Are not responsible for any decisions made based on our content</li>
          </ul>
          
          <h2>7. Intellectual Property</h2>
          <p>All content, including predictions, analyses, and methodologies, is our intellectual property and may not be reproduced without permission.</p>
          
          <h2>8. Account Security</h2>
          <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.</p>
          
          <h2>9. Communication Preferences</h2>
          <p>By using our service, you may receive:</p>
          <ul>
            <li>Email newsletters (if subscribed)</li>
            <li>SMS notifications (if opted in)</li>
            <li>Service updates</li>
          </ul>
          
          <h2>10. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
          
          <h2>11. Termination</h2>
          <p>We reserve the right to terminate or suspend access to our service for any reason, including violation of these terms.</p>
          
          <h2>12. Contact</h2>
          <p>For questions about these terms, contact us through our support channels.</p>
          
          <div className="mt-8 p-4 bg-orange-900/20 rounded-lg">
            <p className="text-orange-400 font-semibold">Legal Disclaimer</p>
            <p className="text-sm">QuantumBets is an entertainment and information service only. We do not accept bets or wagers. Users are responsible for complying with all applicable laws in their jurisdiction.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 