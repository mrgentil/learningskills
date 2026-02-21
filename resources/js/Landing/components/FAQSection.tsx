import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "Sommes-nous propriétaires de la plateforme ?", a: "Oui. Votre académie est déployée comme une instance en marque blanche sous votre marque. Vous conservez la pleine propriété de vos données, de votre contenu et de vos relations avec les apprenants." },
  { q: "Pouvons-nous utiliser notre propre domaine ?", a: "Absolument. Votre académie est lancée sur votre domaine personnalisé (ex: academie.votreorganisation.com) avec un certificat SSL complet." },
  { q: "Fournissez-vous l'hébergement ?", a: "Oui, nous fournissons un hébergement de niveau entreprise avec une disponibilité de 99,9 %, des sauvegardes automatiques et une distribution via CDN mondial." },
  { q: "Pouvons-nous migrer depuis une autre plateforme ?", a: "Oui. Nous offrons un support de migration guidée pour transférer vos cours, vos données apprenants et vos contenus depuis n'importe quelle plateforme existante." },
  { q: "Des connaissances techniques sont-elles requises ?", a: "Pas du tout. Notre plateforme est conçue pour les équipes non techniques. L'interface intuitive ne nécessite aucune compétence en programmation." },
  { q: "Proposez-vous des tarifs pour les associations ?", a: "Oui, nous offrons des tarifs spéciaux pour les organisations à but non lucratif et pouvons aider pour les dossiers de subvention de transformation digitale." },
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
            Questions Fréquemment Posées
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
