import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from '../component/layout/Header';
import AnnouncementBar from '../component/layout/AnnouncementBar';
import Footer from '../component/layout/Footer';
import CartSidebar from '../component/cart/CartSidebar';
import AuthModal from '../component/auth/AuthModal';
import WhatsAppButton from '../component/ui/WhatsAppButton';
import CookieConsent from '../component/common/CookieConsent';
import ActivityTracker from '../component/common/ActivityTracker';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * FONT SETUP (add once in app/layout.tsx, outside this file):
 *
 * import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
 *
 * const fraunces = Fraunces({
 *   subsets: ['latin'],
 *   variable: '--font-fraunces',
 *   weight: ['400', '500', '600'],
 *   style: ['normal', 'italic'],
 * });
 * const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
 * const plexMono = IBM_Plex_Mono({
 *   subsets: ['latin'],
 *   variable: '--font-mono',
 *   weight: ['500'],
 * });
 *
 * // on <body>:
 * className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans`}
 *
 * Tailwind config additions:
 * fontFamily: {
 *   display: ['var(--font-fraunces)', 'serif'],
 *   sans: ['var(--font-inter)', 'sans-serif'],
 *   label: ['var(--font-mono)', 'monospace'],
 * },
 * colors: {
 *   parchment: '#F3EAD8',
 *   ink: '#241F16',
 *   turmeric: '#C4711F',
 *   basil: '#26362A',
 *   millet: '#E4A93D',
 *   clay: '#9C4221',
 * }
 */

const SITE_NAME = "Vrateez";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vrateez.com";
const SITE_DESCRIPTION = "Buy vrat-friendly healthy protein cookies, energy bars & fasting snacks online in India. Perfect for vrat/upvas - made with millet, nuts & seeds. Zero added sugar, high protein, FSSAI certified. Free delivery on orders above ₹499.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vrateez | Buy Vrat Food, Healthy Protein Cookies & Fasting Snacks Online",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
  keywords: [
    // Vrat/Fasting specific
    "vrat food",
    "vrat snacks",
    "vrat cookies",
    "fasting food",
    "fasting snacks",
    "upvas food",
    "upvas snacks",
    "navratri food",
    "navratri snacks",
    "vrat ka khana",
    "vrat food online",
    "healthy vrat snacks",
    "vrat me khane wala",
    "ekadashi food",
    "karwa chauth food",
    // Health & Nutrition
    "protein cookies",
    "healthy snacks",
    "energy bars",
    "healthy cookies",
    "millet cookies",
    "sugar free snacks",
    "high protein snacks",
    "healthy cookies online",
    "wholesome snacks",
    "nutritious snacks",
    "guilt free snacks",
    // Product types
    "almond cookies",
    "cashew cookies",
    "blueberry cookies",
    "protein bars",
    "energy cookies",
    "healthy protein bars",
    // Location & Buying
    "buy protein cookies India",
    "buy vrat food online",
    "order vrat snacks",
    "vrat food delivery",
    "FSSAI certified snacks",
    // Occasions
    "vrat food items",
    "eat in vrat",
    "what to eat during vrat",
    "vrat-friendly food",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Vrateez | Vrat Food, Healthy Protein Cookies & Fasting Snacks",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Vrateez - Vrat Food & Healthy Protein Snacks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrateez | Vrat Food, Healthy Protein Cookies & Fasting Snacks",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@vrateez",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              alternateName: "Vrateez - Vrat Food & Healthy Snacks",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description: SITE_DESCRIPTION,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaipur",
                addressRegion: "Rajasthan",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-9407230914",
                contactType: "Customer Service",
                areaServed: "IN",
                availableLanguage: ["en", "hi"],
              },
              sameAs: [
                "https://instagram.com/vrateez",
                "https://facebook.com/vrateez",
                "https://twitter.com/vrateez",
              ],
            }),
          }}
        />

        {/* Structured Data - WebSite */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/shop?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Structured Data - Store */}
        <Script
          id="store-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: SITE_NAME,
              image: `${SITE_URL}/logo.png`,
              description: "Online store for vrat-friendly healthy protein cookies, energy bars and fasting snacks in India",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaipur",
                addressRegion: "Rajasthan",
                addressCountry: "IN",
              },
              priceRange: "₹₹",
              telephone: "+91-9407230914",
              url: SITE_URL,
              currenciesAccepted: "INR",
              paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
              openingHours: "Mo-Su 00:00-23:59",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <ActivityTracker />
              <AnnouncementBar />
              <Header />
              {children}
              <Footer />
              <CartSidebar />
              <AuthModal />
              <WhatsAppButton />
              <CookieConsent />
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
