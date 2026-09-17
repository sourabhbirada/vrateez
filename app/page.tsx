import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: "Buy Vrat Food, Healthy Protein Cookies & Fasting Snacks Online in India",
  description: "Order vrat-friendly protein cookies, energy bars & fasting snacks online. Perfect for Navratri, Ekadashi & all vrat occasions. Made with millet, nuts & natural ingredients. Zero added sugar, high protein, FSSAI certified. Free shipping on orders above ₹499. Shop now!",
  keywords: [
    "buy vrat food online",
    "vrat snacks",
    "vrat cookies",
    "fasting food India",
    "navratri snacks",
    "healthy vrat food",
    "protein cookies online",
    "vrat ka khana",
    "upvas food",
    "ekadashi food",
    "healthy cookies India",
    "millet snacks",
    "sugar free vrat snacks",
    "high protein vrat food",
    "vrat food delivery",
    "eat in vrat",
    "vrat-friendly snacks"
  ],
  openGraph: {
    title: "Vrateez | Vrat Food, Healthy Protein Cookies & Fasting Snacks",
    description: "Premium vrat-friendly protein cookies, energy bars & fasting snacks. Perfect for Navratri & all vrat occasions. Natural ingredients, zero added sugar, high protein. Free shipping above ₹499.",
  },
};

export default function Home() {
  return <HomePageClient />;
}
