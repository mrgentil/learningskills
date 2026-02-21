import { motion } from "framer-motion";
import { Heart, GraduationCap, Briefcase, Building2, Users } from "lucide-react";

const segments = [
  { icon: Heart, title: "Associations", desc: "Formez vos bénévoles, sensibilisez le public et démultipliez votre impact social.", color: "text-destructive" },
  { icon: GraduationCap, title: "Centres de Formation", desc: "Délivrez vos programmes de certification sous votre propre marque académique.", color: "text-accent" },
  { icon: Briefcase, title: "Coachs & Consultants", desc: "Automatisez votre expertise dans une académie premium qui reflète votre excellence.", color: "text-primary" },
  { icon: Building2, title: "Organisations Professionnelles", desc: "Proposez de la formation continue à vos membres via votre plateforme dédiée.", color: "text-accent" },
  { icon: Users, title: "Entreprises", desc: "Intégrez vos employés et montez vos équipes en compétences à grande échelle.", color: "text-primary" },
];

const WhoItsForSection = () => {
  return (
    <section id="who-its-for" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Pour Qui ?</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Conçu pour les organisations exigeantes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-xl p-8 border border-border hover:shadow-card-hover transition-all ${i >= 3 ? "lg:col-span-1" : ""}`}
            >
              <seg.icon className={`w-8 h-8 ${seg.color} mb-4`} />
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">{seg.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{seg.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
