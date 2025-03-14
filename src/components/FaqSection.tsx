import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does QuantumBets work?",
    answer: "We leverage advanced APIs and the most cutting-edge AI models to collect and analyze more data points than anyone else in the industry. Our systems transform this vast amount of information into actionable insights, identifying high-value betting opportunities with statistical advantages. This data-driven approach allows us to consistently deliver predictions with a high success rate.",
  },
  {
    question: "How often are new picks released?",
    answer: "New picks are released on a daily basis. Our AI continuously analyzes games and matches across multiple sports, providing fresh insights and predictions every 24 hours.",
  },
  {
    question: "How many sports does the program pick?",
    answer: "We cover all major sports including NFL, NBA, MLB, NHL, and international soccer. Our AI is constantly training on new sports and leagues to expand our coverage.",
  },
  {
    question: "What is your success rate?",
    answer: "Our AI model consistently achieves a 68% success rate across all sports, with particularly strong performance in NFL (72%) and NBA (68%) predictions.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! You can cancel your subscription at any time with no questions asked. We believe our service should prove its value every single day.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-20 relative overflow-hidden bg-black">
      {/* Top gradient overlay for seamless transition */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/90 via-black/80 to-transparent z-10"></div>
      
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px]"></div>
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-radial from-orange-500/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/2 left-1/3 w-72 h-72 bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-md text-white/90 text-sm border border-white/10 mb-4">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">Questions</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Get answers to the most common questions about our platform and services.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="group border-b border-white/10 last:border-0"
                >
                  <AccordionTrigger className="py-6 text-left text-white group-hover:text-orange-300 transition-all duration-300 hover:no-underline data-[state=open]:text-orange-300">
                    <div className="flex items-center">
                      <div className="mr-4 opacity-60 text-sm font-mono group-hover:opacity-100 transition-opacity duration-300">
                        0{index + 1}
                      </div>
                      <span className="text-lg font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 py-4 pl-10 text-base">
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-white/70 mb-4">Still have questions?</p>
            <a 
              href="mailto:support@quantumbets.com" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-600/20 to-purple-500/20 backdrop-blur-md text-white hover:from-orange-600/30 hover:to-purple-500/30 border border-white/10 transition-all duration-300"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient overlay for seamless transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/70 via-black/80 to-transparent z-10"></div>
    </section>
  );
};

export default FaqSection;
