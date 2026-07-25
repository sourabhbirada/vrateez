import Link from 'next/link';
import { Home, Search, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-[120px] md:text-[180px] font-extrabold text-ink/10 leading-none">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-4">
          Page Not Found
        </h2>
        <p className="text-ink/60 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-turmeric text-parchment px-6 py-3 rounded-full font-semibold hover:bg-clay transition-colors"
          >
            <Home size={20} />
            Go Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-2 bg-ink text-parchment px-6 py-3 rounded-full font-semibold hover:bg-basil transition-colors"
          >
            <ShoppingBag size={20} />
            Browse Products
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 pt-8 border-t border-ink/10">
          <p className="text-ink/50 text-sm mb-4">Looking for something specific?</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-turmeric font-semibold hover:underline"
          >
            <Search size={16} />
            Search our products
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-8">
          <p className="text-ink/40 text-xs mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/shop?category=cookies" className="text-xs text-ink/60 hover:text-turmeric transition">
              Protein Cookies
            </Link>
            <span className="text-ink/20">•</span>
            <Link href="/shop?category=energy-on-the-go" className="text-xs text-ink/60 hover:text-turmeric transition">
              Energy Bars
            </Link>
            <span className="text-ink/20">•</span>
            <Link href="/bulk-order" className="text-xs text-ink/60 hover:text-turmeric transition">
              Bulk Orders
            </Link>
            <span className="text-ink/20">•</span>
            <Link href="/faq" className="text-xs text-ink/60 hover:text-turmeric transition">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
