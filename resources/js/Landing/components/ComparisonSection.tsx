import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  { feature: "Branding", typical: "Limited", ours: "Full Ownership" },
  { feature: "Domain", typical: "Shared", ours: "Custom" },
  { feature: "Data Ownership", typical: "Platform-Owned", ours: "Organization-Owned" },
  { feature: "Customization", typical: "Low", ours: "High" },
  { feature: "Long-Term Cost", typical: "Increasing", ours: "Controlled" },
  { feature: "Scalability", typical: "Capped", ours: "Unlimited" },
];

const ComparisonSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Comparison</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Not Another LMS — A Platform You Own
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border shadow-card"
        >
          <div className="grid grid-cols-3 bg-primary text-primary-foreground">
            <div className="p-4 font-display font-semibold text-sm">Feature</div>
            <div className="p-4 font-display font-semibold text-sm text-center">Typical LMS</div>
            <div className="p-4 font-display font-semibold text-sm text-center bg-accent/20">Our Platform</div>
          </div>
          {rows.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
              <div className="p-4 text-sm font-medium text-foreground">{row.feature}</div>
              <div className="p-4 text-sm text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <X className="w-4 h-4 text-destructive" />
                {row.typical}
              </div>
              <div className="p-4 text-sm text-center font-medium text-foreground flex items-center justify-center gap-1.5 bg-accent/5">
                <Check className="w-4 h-4 text-accent" />
                {row.ours}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
