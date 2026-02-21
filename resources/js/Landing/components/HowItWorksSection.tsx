import { motion } from "framer-motion";
import { MessageSquare, Rocket, Settings, TrendingUp } from "lucide-react";

const steps = [
  { icon: MessageSquare, step: "01", title: "Stratégie & Intégration", desc: "Nous analysons vos objectifs et votre public pour concevoir l'architecture pédagogique optimale." },
  { icon: Settings, step: "02", title: "Déploiement de Plateforme", desc: "Votre instance en marque blanche est configurée et lancée sur votre domaine en quelques jours." },
  { icon: Rocket, step: "03", title: "Configuration Académique", desc: "Importez vos cours, configurez les certificats et invitez votre première cohorte d'apprenants." },
  { icon: TrendingUp, step: "04", title: "Lancement & Évolution", desc: "Lancez-vous en toute confiance. Nous vous accompagnons dans votre montée en charge et succès." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Processus</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            De votre vision au lancement en quatre étapes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6 relative">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
