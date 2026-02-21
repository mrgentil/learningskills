import { motion } from "framer-motion";
import {
  Video, FileText, Radio, Languages, Award, MessageCircle,
  Globe, CreditCard, BarChart3,
} from "lucide-react";

const features = [
  { icon: Video, title: "Course Builder", desc: "Create courses with video, PDF, quizzes, and assessments in minutes." },
  { icon: Radio, title: "Live Classes & Webinars", desc: "Host real-time sessions with integrated scheduling and recording." },
  { icon: Languages, title: "AI Transcription & Translation", desc: "Auto-transcribe content and translate into multiple languages." },
  { icon: Award, title: "Certificates & Tracking", desc: "Issue branded certificates and monitor learner progress." },
  { icon: MessageCircle, title: "Discussion Communities", desc: "Build peer-to-peer learning communities within your academy." },
  { icon: Globe, title: "Custom Domains", desc: "Launch on your own URL with full SSL and white-label branding." },
  { icon: CreditCard, title: "Payment Integration", desc: "Monetize courses with Stripe and flexible pricing options." },
  { icon: BarChart3, title: "Student Analytics", desc: "Deep insights into engagement, completion rates, and ROI." },
  { icon: FileText, title: "Content Library", desc: "Centralized repository for all learning materials and resources." },
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
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Features</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Everything You Need to Run a World-Class Academy
          </h2>
          <p className="text-muted-foreground text-lg">
            Purpose-built tools focused on outcomes, not complexity.
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
