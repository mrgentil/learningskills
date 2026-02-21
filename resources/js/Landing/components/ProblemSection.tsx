import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Lock, Puzzle, Eye } from "lucide-react";

const problems = [
  { icon: Eye, title: "No Brand Identity", desc: "Platforms carry someone else's branding, not yours." },
  { icon: DollarSign, title: "Growing SaaS Costs", desc: "Monthly fees that scale with every new learner." },
  { icon: Lock, title: "Limited Customization", desc: "Locked templates that don't match your vision." },
  { icon: AlertTriangle, title: "No Data Ownership", desc: "Your learner data sits on someone else's servers." },
  { icon: Puzzle, title: "Fragmented Tools", desc: "Zoom, PDFs, emails — nothing is unified." },
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">The Problem</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Why Most Organizations Struggle With Online Training
          </h2>
          <p className="text-muted-foreground text-lg">
            Off-the-shelf platforms create dependency, limit growth, and dilute your brand.
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
