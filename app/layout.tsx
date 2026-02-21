import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from '../component/layout/Header';
import Footer from '../component/layout/Footer';
import CartSidebar from '../component/cart/CartSidebar';
import AuthModal from '../component/auth/AuthModal';
import WhatsAppButton from '../component/ui/WhatsAppButton';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vrateez — Protein Cookies & Energy Bars",
  description: "High-protein cookies, energy bars & superfood snacks with real ingredients and no added sugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <CartSidebar />
            <AuthModal />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
