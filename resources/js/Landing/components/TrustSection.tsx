import { motion } from "framer-motion";
import { Shield, Clock, Server, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Lancer notre propre académie a transformé notre mode de formation. Les inscriptions ont augmenté de 300% dès le premier trimestre.",
    author: "Sarah Chen",
    role: "Directrice de l'Apprentissage, Global Health Foundation",
  },
  {
    quote: "L'approche en marque blanche signifie que nos membres voient notre marque partout. C'est un saut qualitatif pour notre image.",
    author: "Marc Williams",
    role: "CEO, National Coaching Association",
  },
  {
    quote: "Nous avons migré en moins de deux semaines. Le modèle de propriété de la plateforme nous fait déjà réaliser des économies majeures.",
    author: "Elena Rodriguez",
    role: "VP Opérations, TechTrain Institute",
  },
];

const badges = [
  { icon: Shield, label: "Conforme SOC 2" },
  { icon: Server, label: "Uptime SLA 99.9%" },
  { icon: Clock, label: "Monitoring 24/7" },
  { icon: Star, label: "Prêt pour le RGPD" },
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Confiance & Excellence</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Approuvé par des organisations visionnaires
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-xl p-8 border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-display font-semibold text-foreground">{t.author}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 px-5 py-3 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground">
              <badge.icon className="w-4 h-4 text-accent" />
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
