import { motion } from "framer-motion";
import { Heart, GraduationCap, Briefcase, Building2, Users } from "lucide-react";

const segments = [
  { icon: Heart, title: "Nonprofits", desc: "Train volunteers, educate communities, and scale impact with branded learning programs.", color: "text-destructive" },
  { icon: GraduationCap, title: "Training Organizations", desc: "Deliver professional development and certification programs under your own academy brand.", color: "text-accent" },
  { icon: Briefcase, title: "Coaches & Consultants", desc: "Package your expertise into a premium digital academy that reflects your personal brand.", color: "text-primary" },
  { icon: Building2, title: "Associations", desc: "Provide continuing education and member development through your organization's own platform.", color: "text-accent" },
  { icon: Users, title: "Businesses", desc: "Onboard employees, upskill teams, and build internal knowledge bases at scale.", color: "text-primary" },
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Who It's For</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Built for Organizations That Demand More
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
