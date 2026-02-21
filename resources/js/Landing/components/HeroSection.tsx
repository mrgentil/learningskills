import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  return (
    <section className="relative bg-hero min-h-screen flex items-center overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }} />

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-primary-foreground/70">Infrastructure d'Apprentissage en Marque Blanche</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.1] mb-6">
              Bâtissez Votre Propre{" "}
              <span className="text-gradient">Académie Digitale</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/60 leading-relaxed mb-8 max-w-xl">
              Une plateforme e-learning entièrement à votre image, conçue pour les organisations qui veulent former, certifier et grandir — sans dépendre d'outils tiers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/register">
                <Button size="lg" className="bg-gradient-accent text-primary font-bold text-base px-8 h-13 hover:opacity-90 transition-opacity group">
                  Démarrer Gratuitement
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-medium text-base px-8 h-13">
                  <Play className="mr-2 w-4 h-4" />
                  Voir Comment ça Marche
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-primary-foreground/10">
              {[
                { value: "500+", label: "Organizations" },
                { value: "1M+", label: "Learners" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-2xl text-primary-foreground">{stat.value}</p>
                  <p className="text-xs text-primary-foreground/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={heroDashboard}
                alt="Digital Academy platform dashboard showing course analytics and student progress"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -top-4 -right-4 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
