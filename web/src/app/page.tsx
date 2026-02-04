import {
  Hero,
  Stats,
  Problem,
  Features,
  FeatureDeepDives,
  Testimonials,
  Pricing,
  CTA,
} from "@/components/landing";

import Navbar from "@/components/core/navbar";
import Footer from "@/components/core/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Problem />
        <Features />
        <FeatureDeepDives />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
