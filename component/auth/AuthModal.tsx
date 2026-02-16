'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
    const { isLoginOpen, isSignup, closeAuth, login, signup, openLogin, openSignup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isLoginOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignup) {
            signup(name, email, password);
        } else {
            login(email, password);
        }
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeAuth} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 px-8 pt-8 pb-6">
                        <button
                            onClick={closeAuth}
                            className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {isSignup ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {isSignup
                                ? 'Join Vrateez for exclusive offers & faster checkout'
                                : 'Log in to your Vrateez account'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                        {isSignup && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                <div className="relative mt-1">
                                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                            <div className="relative mt-1">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                            <div className="relative mt-1">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                        >
                            {isSignup ? 'CREATE ACCOUNT' : 'LOG IN'}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="px-8 pb-6 text-center text-sm text-gray-500">
                        {isSignup ? (
                            <>Already have an account?{' '}
                                <button onClick={openLogin} className="text-orange-600 font-semibold hover:underline">Log In</button>
                            </>
                        ) : (
                            <>Don&apos;t have an account?{' '}
                                <button onClick={openSignup} className="text-orange-600 font-semibold hover:underline">Sign Up</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
