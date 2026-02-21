import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }} />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Prêt à Lancer l'Académie Digitale de Votre Organisation ?
          </h2>
          <p className="text-lg text-primary-foreground/60 mb-10 max-w-xl mx-auto">
            Rejoignez LearningSkills aujourd'hui et commencez à transformer vos connaissances en succès collectif.
          </p>
          <a href="/register">
            <Button size="lg" className="bg-gradient-accent text-accent-foreground font-semibold text-lg px-10 h-14 hover:opacity-90 transition-opacity group">
              Commencer Maintenant
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <p className="text-sm text-primary-foreground/40 mt-4">Sans engagement · Déploiement rapide · Support dédié</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
