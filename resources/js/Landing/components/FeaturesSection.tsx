import { motion } from "framer-motion";
import {
  Video, FileText, Radio, Languages, Award, MessageCircle,
  Globe, CreditCard, BarChart3,
} from "lucide-react";

const features = [
  { icon: Video, title: "Créateur de Cours", desc: "Créez des cours avec vidéos, PDFs, quiz et évaluations en quelques minutes." },
  { icon: Radio, title: "Classes en Direct", desc: "Animez des sessions en temps réel avec planification et enregistrement intégrés." },
  { icon: Languages, title: "IA & Traduction", desc: "Transcrivez automatiquement vos contenus et traduisez-les en plusieurs langues." },
  { icon: Award, title: "Certificats & Suivi", desc: "Délivrez des certificats à votre image et suivez la progression des apprenants." },
  { icon: MessageCircle, title: "Communautés", desc: "Favorisez l'apprentissage entre pairs au sein de votre académie digitale." },
  { icon: Globe, title: "Domaines Personnalisés", desc: "Lancez votre plateforme sur votre propre URL avec SSL complet." },
  { icon: CreditCard, title: "Paiements Intégrés", desc: "Monétisez vos formations avec Stripe et des options de tarifs flexibles." },
  { icon: BarChart3, title: "Analyses de Données", desc: "Insights profonds sur l'engagement, les taux de complétion et le ROI." },
  { icon: FileText, title: "Gestion des Contenus", desc: "Référentiel centralisé pour tous vos supports et ressources pédagogiques." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Tout ce dont vous avez besoin pour une Académie de Classe Mondiale
          </h2>
          <p className="text-muted-foreground text-lg">
            Des outils conçus pour l'efficacité, pas pour la complexité.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-accent/30 hover:shadow-card-hover transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center mb-4 transition-colors">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
