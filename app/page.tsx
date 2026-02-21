import HeroSection from '@/component/home/HeroSection';
import BenefitsSection from '@/component/home/BenefitsSection';
import NewLaunchesSection from '@/component/home/NewLaunchesSection';
import ProductsSection from '@/component/home/ProductsSection';
import TestimonialsSection from '@/component/home/TestimonialsSection';
import OurProductsSection from '@/component/home/OurProductsSection';
import AvailableAtSection from '@/component/home/AvailableAtSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BenefitsSection />
      <div id="new-launches">
        <NewLaunchesSection />
      </div>
      <ProductsSection />
      <TestimonialsSection />
      <OurProductsSection />
      <AvailableAtSection />
    </main>
  );
}
