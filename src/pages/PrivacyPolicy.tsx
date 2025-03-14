import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use QuantumBets.</p>
          
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li>Email address</li>
            <li>Phone number (if SMS service is opted into)</li>
            <li>Account credentials</li>
            <li>Communication preferences</li>
            <li>Payment information (processed securely through our payment providers)</li>
          </ul>
          
          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li>Device information</li>
            <li>Log data</li>
            <li>Usage patterns</li>
            <li>IP address</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Send you predictions and analyses</li>
            <li>Process your payments</li>
            <li>Send service updates</li>
            <li>Respond to your inquiries</li>
            <li>Improve our service</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your information, including:</p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Secure data storage</li>
            <li>Limited access to personal information</li>
          </ul>
          
          <h2>5. Third-Party Services</h2>
          <p>We may use third-party services that collect, monitor, and analyze data. These services include:</p>
          <ul>
            <li>Payment processors</li>
            <li>Analytics providers</li>
            <li>Email service providers</li>
            <li>SMS service providers</li>
          </ul>
          
          <h2>6. Communications</h2>
          <p>We may contact you via:</p>
          <ul>
            <li>Email (for newsletters and account updates)</li>
            <li>SMS (if opted in, for time-sensitive predictions)</li>
            <li>Push notifications (if enabled)</li>
          </ul>
          
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Opt-out of communications</li>
            <li>Export your data</li>
          </ul>
          
          <h2>8. Data Retention</h2>
          <p>We retain your information as long as your account is active or as needed to provide services. You can request data deletion at any time.</p>
          
          <h2>9. Children's Privacy</h2>
          <p>Our service is not intended for users under the legal age for sports betting in their jurisdiction. We do not knowingly collect information from minors.</p>
          
          <h2>10. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
          
          <h2>11. Changes to This Policy</h2>
          <p>We may update this policy periodically. We will notify you of any significant changes via email or service notification.</p>
          
          <h2>12. Contact Us</h2>
          <p>For questions about this Privacy Policy, please contact us through our support channels.</p>
          
          <div className="mt-8 p-4 bg-orange-900/20 rounded-lg">
            <p className="text-orange-400 font-semibold">Data Protection Notice</p>
            <p className="text-sm">We take your privacy seriously and implement strong safeguards to protect your information. You have control over your data and can manage your preferences at any time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 