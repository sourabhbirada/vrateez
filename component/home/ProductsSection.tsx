'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductsApi } from '@/lib/api/productApi';
import { getCategoriesApi } from '@/lib/api/categoryApi';
import type { Category, Product } from '@/lib/api/types';

type ProductView = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: string;
  weight: string;
};

function mapProduct(p: Product): ProductView {
  return {
    id: p._id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    weight: p.weight,
  };
}

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<ProductView[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [productData, categoryData] = await Promise.all([
          getProductsApi({ limit: 100 }),
          getCategoriesApi(),
        ]);
        if (cancelled) return;
        setProducts(productData.items.map(mapProduct));
        setCategories(categoryData);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filters = [
    { key: 'all', label: 'All' },
    ...categories.map((c) => ({ key: c.slug, label: c.name })),
  ];

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: ProductView) => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      weight: product.weight,
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-parchment" id="products">
        <div className="max-w-7xl mx-auto px-8 text-center text-ink/50 text-sm">Loading products…</div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-16 bg-parchment" id="products">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="font-display italic text-4xl text-center text-ink mb-4">Our Products</h2>
        <p className="text-center text-ink/50 mb-10 max-w-2xl mx-auto text-sm leading-relaxed">
          High-protein cookies, energy bars &amp; superfood snacks — all crafted with real ingredients and zero added
          sugar.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeCategory === cat.key
                  ? 'bg-ink text-parchment shadow-lg'
                  : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group bg-white/60 border border-ink/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square bg-ink/5 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discount ? (
                    <span className="absolute top-3 left-3 bg-basil text-parchment text-xs font-bold px-3 py-1 rounded-full">
                      {product.discount}
                    </span>
                  ) : null}
                </div>
              </Link>

              <div className="p-5">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-sm font-bold text-ink uppercase mb-2 line-clamp-2 hover:text-turmeric transition">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-ink/40 mb-2">{product.weight}</p>

                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? 'fill-millet text-millet' : 'text-ink/15'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-ink/40">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-ink">₹{product.price}</span>
                  {product.originalPrice > product.price ? (
                    <span className="text-sm text-ink/30 line-through">₹{product.originalPrice}</span>
                  ) : null}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-ink text-parchment py-3 rounded-full font-semibold text-sm hover:bg-turmeric transition-colors cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
