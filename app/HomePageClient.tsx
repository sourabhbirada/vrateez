'use client';

import HeroSection from '@/component/home/HeroSection';
import DealOfferSection from '@/component/home/DealOfferSection';
import BenefitsSection from '@/component/home/BenefitsSection';
import ProductsSection from '@/component/home/ProductsSection';
import TestimonialsSection from '@/component/home/TestimonialsSection';
import OurProductsSection from '@/component/home/OurProductsSection';
import AvailableAtSection from '@/component/home/AvailableAtSection';
import { useSettings } from '@/context/SettingsContext';

export default function HomePage() {
  const { settings, loading } = useSettings();
  const sections = settings?.appearance?.homepageSections;

  if (loading) {
    return <main className="min-h-[50vh] bg-parchment" />;
  }

  return (
    <main>
      {(sections?.heroCarousel ?? true) && <HeroSection />}
      <DealOfferSection />
      {(sections?.benefitsSection ?? true) && <BenefitsSection />}
      <ProductsSection />
      {(sections?.testimonials ?? true) && <TestimonialsSection />}
      {(sections?.ourProducts ?? true) && <OurProductsSection />}
      {(sections?.availableAtPartners ?? true) && <AvailableAtSection />}
    </main>
  );
}
