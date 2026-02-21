import { motion } from "framer-motion";
import { Globe, Palette, Users, Database, Check } from "lucide-react";

const pillars = [
  { icon: Globe, title: "Your Domain", desc: "Launch on your own custom domain with full SSL." },
  { icon: Palette, title: "Your Branding", desc: "Colors, logos, and design — entirely yours." },
  { icon: Users, title: "Your Learners", desc: "Own every relationship and interaction." },
  { icon: Database, title: "Your Data", desc: "Full data sovereignty, no vendor lock-in." },
];

const SolutionSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">The Solution</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              One Platform. Fully Yours.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              A white-label digital academy deployed on your infrastructure, scaled to your ambition, and branded to your identity.
            </p>

            <div className="space-y-4">
              {["White-label deployment under your brand", "Hosted on your environment", "Scalable learning infrastructure", "Enterprise-grade security & compliance"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-xl p-6 border border-border hover:border-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <pillar.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
