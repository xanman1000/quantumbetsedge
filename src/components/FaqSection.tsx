
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is QuantumBets?",
    answer: "QuantumBets is a cutting-edge sports betting analytics platform powered by AI.",
  },
  {
    question: "How often are new picks released?",
    answer: "New picks are released on a daily basis.",
  },
  {
    question: "How many sports does the program pick?",
    answer: "That depends on a number of things; we aim to pick every sport.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-20 bg-quantum-neutral">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
