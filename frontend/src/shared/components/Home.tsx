import { Hero } from "./sections/Hero";
import { FeaturesSection } from "./sections/FeaturesSection";
import ServicesSection from "./ServicesSection";
import TopDoctors from "./TopDoctors";
import WhyUsSection from "./WhyUsSection";
import TestimonialsSection from "./TestimonialsSection";
import { CTASection } from "./sections/CTASection";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <FeaturesSection />
      <ServicesSection />
      <TopDoctors />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}