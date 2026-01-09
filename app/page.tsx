/**
 * Homepage - Tell Their Stories
 * 
 * Purpose: Marketing landing page for the platform
 * 
 * Key Elements:
 * - Navigation bar
 * - Hero section with headline and CTAs
 * - Feature showcase
 * - Value propositions
 * - CTA section
 * - Footer
 * 
 * Dependencies:
 * - @/components/layout/MarketingNav
 * - @/components/layout/Footer
 * - @/components/marketing/Hero
 * - @/components/marketing/FeatureShowcase
 * - @/components/marketing/ValueProps
 * - @/components/marketing/CTASection
 * 
 * Last Updated: Initial setup
 */

import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { ValueProps } from "@/components/marketing/ValueProps";
import { CTASection } from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main>
        <Hero />
        <FeatureShowcase />
        <ValueProps />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
