'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { getProductsApi } from '@/lib/api/productApi';
import type { Product } from '@/lib/api/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProductsApi({ limit: 100 });
                setProducts(response.items);
            } catch {
                setProducts([]);
            }
        }

        if (isOpen) {
            void loadProducts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!isOpen) return null;

    const results = query.trim().length > 0
        ? products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-20 px-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Search input */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b">
                        <Search size={20} className="text-gray-400 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search cookies, energy bars, dates..."
                            className="flex-1 text-base outline-none placeholder:text-gray-400"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded-md"
                        >
                            ESC
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {query.trim().length === 0 ? (
                            <div className="px-6 py-8 text-center text-gray-400 text-sm">
                                <p>Start typing to search our products...</p>
                                <div className="flex justify-center gap-2 mt-4">
                                    {['Cookies', 'Energy Bar', 'Almond', 'Blueberry'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 transition"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="px-6 py-8 text-center text-gray-400 text-sm">
                                No products found for &quot;{query}&quot;
                            </div>
                        ) : (
                            <div className="p-2">
                                {results.map(product => (
                                    <Link
                                        key={product._id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                                    >
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                                            <p className="text-xs text-gray-500 capitalize">{product.category.replace('-', ' ')} · {product.weight}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                                            <span className="block text-xs text-green-600 font-semibold">{product.discount}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
