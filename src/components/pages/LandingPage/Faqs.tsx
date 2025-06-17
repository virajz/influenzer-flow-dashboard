import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: 'How does the AI-powered outreach work?',
        answer: 'Our AI analyzes creator profiles, past performance, and your brand requirements to craft personalized outreach messages that have a higher response rate than generic templates.'
    },
    {
        question: 'Can I integrate with my existing tools?',
        answer: 'Yes, we offer integrations with popular marketing tools, CRM systems, and social media platforms. Our API also allows for custom integrations.'
    },
    {
        question: 'What kind of support do you provide?',
        answer: 'We offer email support for all plans, priority support for Professional plans, and dedicated account managers for Enterprise clients.'
    },
    {
        question: 'Is there a free trial?',
        answer: 'Yes, we offer a 14-day free trial with full access to Professional features. No credit card required.'
    },
    {
        question: 'How do you ensure creator authenticity?',
        answer: 'We use advanced verification systems and analyze engagement patterns to identify authentic creators and flag potential fake accounts.'
    }
];

export const Faqs = () => {
    return (
        <section id="faq" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Everything you need to know
            </p>
          </div>

          <div className="max-w-3xl mx-auto animate-fade-in">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover-scale">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
}