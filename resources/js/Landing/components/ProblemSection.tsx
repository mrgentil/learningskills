import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Lock, Puzzle, Eye } from "lucide-react";

const problems = [
  { icon: Eye, title: "Identité Diluée", desc: "Les plateformes portent la marque d'un autre, pas la vôtre." },
  { icon: DollarSign, title: "Coûts SaaS Galopants", desc: "Des frais mensuels qui grimpent avec chaque nouvel apprenant." },
  { icon: Lock, title: "Personnalisation Limitée", desc: "Des modèles verrouillés qui ne correspondent pas à votre vision." },
  { icon: AlertTriangle, title: "Souveraineté des Données", desc: "Vos données apprenants résident sur les serveurs d'un tiers." },
  { icon: Puzzle, title: "Outils Fragmentés", desc: "Zoom, PDFs, emails — rien n'est unifié pour l'apprentissage." },
];

const ProblemSection = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Le Problème</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Pourquoi la plupart des organisations peinent avec la formation en ligne
          </h2>
          <p className="text-muted-foreground text-lg">
            Les plateformes standards créent de la dépendance, limitent votre croissance et diluent votre image de marque.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {problems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
