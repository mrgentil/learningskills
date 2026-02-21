import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "Do we own the platform?", a: "Yes. Your academy is deployed as a white-label instance under your brand. You retain full ownership of your data, content, and learner relationships." },
  { q: "Can we use our own domain?", a: "Absolutely. Your academy launches on your custom domain (e.g., academy.yourorg.com) with full SSL encryption and brand identity." },
  { q: "Do you provide hosting?", a: "Yes, we provide enterprise-grade hosting with 99.9% uptime SLA, automatic backups, and global CDN distribution for fast loading worldwide." },
  { q: "Can we migrate from Kajabi or another platform?", a: "Yes. We provide guided migration support to transfer your courses, learner data, and content from any existing platform with minimal downtime." },
  { q: "Is technical knowledge required?", a: "Not at all. Our platform is designed for non-technical teams. The intuitive course builder and admin dashboard require zero coding skills." },
  { q: "Can nonprofits apply for special funding or discounts?", a: "Yes, we offer special pricing for registered nonprofits and can assist with grant application documentation for digital transformation funding." },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-card"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
