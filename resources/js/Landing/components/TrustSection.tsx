import { motion } from "framer-motion";
import { Shield, Clock, Server, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Launching our own branded academy transformed how we deliver training. Enrollment increased by 300% in the first quarter.",
    author: "Sarah Chen",
    role: "Director of Learning, Global Health Foundation",
  },
  {
    quote: "The white-label approach means our members see our brand at every touchpoint. It's been a game-changer for professional development.",
    author: "Marcus Williams",
    role: "CEO, National Coaching Association",
  },
  {
    quote: "We migrated from Kajabi in under two weeks. The platform ownership model has already saved us significant costs.",
    author: "Elena Rodriguez",
    role: "VP Operations, TechTrain Institute",
  },
];

const badges = [
  { icon: Shield, label: "SOC 2 Compliant" },
  { icon: Server, label: "99.9% Uptime SLA" },
  { icon: Clock, label: "24/7 Monitoring" },
  { icon: Star, label: "GDPR Ready" },
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Trust & Authority</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Trusted by Forward-Thinking Organizations
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
