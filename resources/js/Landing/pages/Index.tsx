import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import ComparisonSection from "@/components/ComparisonSection";
import PackagesSection from "@/components/PackagesSection";
import TrustSection from "@/components/TrustSection";
import FinalCTASection from "@/components/FinalCTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <ComparisonSection />
      <PackagesSection />
      <TrustSection />
      <FinalCTASection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
