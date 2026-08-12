import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: "Buy Healthy Protein Cookies & Vrat Snacks Online in India",
  description: "Order protein-rich millet cookies, energy bars & vrat-friendly snacks online. Made with natural ingredients, zero added sugar, high protein. Free shipping on orders above ₹499. Shop now!",
  keywords: ["buy protein cookies online", "vrat snacks", "healthy cookies India", "millet snacks", "sugar free snacks online", "high protein food"],
  openGraph: {
    title: "Vrateez | Healthy Protein Cookies & Vrat Snacks",
    description: "Premium protein cookies, energy bars & vrat-friendly snacks. Natural ingredients, zero added sugar. Free shipping above ₹499.",
  },
};

export default function Home() {
  return <HomePageClient />;
}
