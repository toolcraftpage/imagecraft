import { Helmet } from 'react-helmet-async';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ToolsShowcase from './components/ToolsShowcase';
import HowItWorks from './components/HowItWorks';
import StatsSection from './components/StatsSection';
import CTASection from './components/CTASection';
import ContactSection from './components/ContactSection';   // ← NEW

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>ImageCraft – Professional Browser Image Tools</title>
        <meta
          name="description"
          content="Compress, resize, crop, remove backgrounds, and more – all inside your browser. 100% free and private."
        />
      </Helmet>

      <HeroSection />
      <FeaturesSection />
      <ToolsShowcase />
      <HowItWorks />
      <StatsSection />
      <CTASection />
      <ContactSection />   {/* ← NEW – replaces Testimonials */}
    </>
  );
}