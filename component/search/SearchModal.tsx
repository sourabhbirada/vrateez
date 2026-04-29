'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { getProductsApi } from '@/lib/api/productApi';
import type { Product } from '@/lib/api/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const QUICK_TAGS = ['Cookies', 'Energy Bar', 'Almond', 'Blueberry', 'Millet', 'Vrat'];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        getProductsApi({ limit: 100 })
            .then(res => setProducts(res.items))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
        else setQuery('');
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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

    const hasQuery = query.trim().length > 0;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-16 md:pt-24">
                <div
                    className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Input row */}
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-100">
                        <Search size={17} className="text-stone-400 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none"
                        />
                        <div className="flex items-center gap-2">
                            {hasQuery && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="p-1 rounded-md hover:bg-stone-100 text-stone-400 transition"
                                >
                                    <X size={15} />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="text-[11px] text-stone-400 border border-stone-200 rounded px-1.5 py-0.5 hover:bg-stone-50 transition"
                            >
                                ESC
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="max-h-[420px] overflow-y-auto">

                        {/* Empty state — quick tags */}
                        {!hasQuery && (
                            <div className="px-5 py-5">
                                <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-3">
                                    Quick search
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="px-3.5 py-1.5 bg-stone-100 hover:bg-amber-100 hover:text-amber-800 text-stone-600 text-xs font-medium rounded-full transition"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {hasQuery && loading && (
                            <div className="px-5 py-8 text-center text-sm text-stone-400">
                                Searching...
                            </div>
                        )}

                        {/* No results */}
                        {hasQuery && !loading && results.length === 0 && (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-stone-500">
                                    No products found for <span className="font-semibold text-stone-700">"{query}"</span>
                                </p>
                                <p className="text-xs text-stone-400 mt-1">Try a different keyword</p>
                            </div>
                        )}

                        {/* Results */}
                        {hasQuery && !loading && results.length > 0 && (
                            <div className="p-2">
                                <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase px-3 pt-2 pb-3">
                                    {results.length} result{results.length !== 1 ? 's' : ''}
                                </p>
                                {results.map(product => (
                                    <Link
                                        key={product._id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-stone-50 transition group"
                                    >
                                        {/* Image */}
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-stone-900 truncate">{product.name}</p>
                                            <p className="text-xs text-stone-400 mt-0.5 capitalize">
                                                {product.category.replace('-', ' ')} · {product.weight}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right flex-shrink-0 flex items-center gap-2">
                                            <div>
                                                <p className="text-sm font-bold text-stone-900">₹{product.price}</p>
                                                {product.discount && (
                                                    <p className="text-xs text-green-600 font-medium">{product.discount}</p>
                                                )}
                                            </div>
                                            <ArrowUpRight
                                                size={15}
                                                className="text-stone-300 group-hover:text-amber-600 transition-colors"
                                            />
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