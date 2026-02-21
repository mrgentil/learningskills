import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Shield, Sparkles, Crown } from "lucide-react";
import { useEffect, useState } from "react";

const TIER_ICONS: Record<string, any> = {
  starter: Shield,
  pro: Sparkles,
  enterprise: Crown,
};

const TIER_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  starter: { accent: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
  pro: { accent: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  enterprise: { accent: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
};

const PackagesSection = () => {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if ((window as any).APP_DATA?.plans) {
      setPlans((window as any).APP_DATA.plans);
    }
  }, []);

  return (
    <section id="packages" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Tarifs</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Choisissez la Fondation Idéale pour Votre Académie
          </h2>
          <p className="text-muted-foreground text-lg">
            Un paiement unique. Votre plateforme. Votre marque. Vos données.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((pkg, i) => {
            const isHighlighted = pkg.slug === 'pro' || pkg.tier === 'pro';
            const isOneTime = (pkg.pricing_type || 'one_time') === 'one_time';
            const tier = pkg.tier || 'starter';
            const tierColor = TIER_COLORS[tier] || TIER_COLORS.starter;
            const TierIcon = TIER_ICONS[tier] || Shield;

            // Parse features
            let features = pkg.features;
            if (typeof features === 'string') {
              try { features = JSON.parse(features); } catch { features = features.split('\n'); }
            }
            if (!Array.isArray(features)) features = [];

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 border transition-all flex flex-col h-full ${isHighlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-elevated scale-[1.05] z-10"
                  : "bg-card text-foreground border-border hover:shadow-card-hover"
                  }`}
              >
                {isHighlighted && (
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-accent text-accent-foreground mb-4 w-fit">
                    ⭐ Recommandé
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <TierIcon className={`w-5 h-5 ${isHighlighted ? "text-accent" : tierColor.accent}`} />
                  <h3 className="font-display text-2xl font-bold">{pkg.name}</h3>
                </div>

                {pkg.description && (
                  <p className={`text-sm mb-4 ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {pkg.description}
                  </p>
                )}

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{Number(pkg.price).toLocaleString('fr-CA')} $</span>
                    {isOneTime ? (
                      <span className={`text-sm ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>CAD</span>
                    ) : (
                      <span className={`text-sm ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        / {pkg.interval === 'year' ? 'an' : 'mois'}
                      </span>
                    )}
                  </div>
                  {isOneTime && (
                    <p className={`text-xs mt-1 ${isHighlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      Paiement unique · incluant installation
                    </p>
                  )}
                  {isOneTime && pkg.maintenance_price > 0 && (
                    <p className={`text-xs mt-1 ${isHighlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      + {Number(pkg.maintenance_price).toLocaleString('fr-CA')} $/an maintenance recommandée
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {features.map((f: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm leading-relaxed">
                      <Check className={`w-4 h-4 flex-shrink-0 ${isHighlighted ? "text-accent" : tierColor.accent}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={`/onboarding?plan=${pkg.tier || pkg.slug}`} className="block mt-auto">
                  <Button
                    className={`w-full font-semibold ${isHighlighted
                      ? "bg-gradient-accent text-accent-foreground hover:opacity-90"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                  >
                    Nous contacter
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
