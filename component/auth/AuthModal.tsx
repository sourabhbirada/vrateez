'use client';
import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, UserIcon, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
    const {
        isLoginOpen,
        isSignup,
        closeAuth,
        login,
        signup,
        requestEmailOtp,
        verifyEmailOtp,
        pendingEmailOtp,
        clearPendingEmailOtp,
        openLogin,
        openSignup,
        isLoading,
        authError,
        clearError,
    } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');

    if (!isLoginOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (pendingEmailOtp) {
            const ok = await verifyEmailOtp(pendingEmailOtp, otp.trim());
            if (!ok) return;
            setName('');
            setEmail('');
            setPassword('');
            setPhone('');
            setOtp('');
            return;
        }

        if (isSignup) {
            const result = await signup(name, email, password, phone.trim() || undefined);
            if (result === 'otp') {
                setPassword('');
                setOtp('');
                return;
            }
            if (result !== 'loggedIn') return;
        } else {
            const success = await login(email, password);
            if (!success) return;
        }

        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeAuth} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="relative bg-linear-to-br from-amber-50 to-orange-100 px-8 pt-8 pb-6">
                        <button
                            onClick={closeAuth}
                            className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {pendingEmailOtp
                                ? 'Verify your email'
                                : isSignup
                                    ? 'Create Account'
                                    : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {pendingEmailOtp
                                ? 'Enter the 6-digit code sent to your email.'
                                : isSignup
                                    ? 'Join Vrateez for exclusive offers & faster checkout'
                                    : 'Log in to your Vrateez account'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                        {pendingEmailOtp && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                <div className="mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
                                    {pendingEmailOtp}
                                </div>
                            </div>
                        )}

                        {!pendingEmailOtp && isSignup && (
                            <>
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
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile (optional)</label>
                                    <div className="relative mt-1">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="9876543210 — for orders & Razorpay"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {!pendingEmailOtp && (
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
                        )}

                        {!pendingEmailOtp && (
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
                        )}

                        {pendingEmailOtp && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition tracking-[0.35em] text-center"
                                />
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <button
                                        type="button"
                                        onClick={() => requestEmailOtp(pendingEmailOtp)}
                                        className="text-orange-600 font-semibold hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearPendingEmailOtp}
                                        className="text-gray-500 hover:underline"
                                    >
                                        Use another email
                                    </button>
                                </div>
                            </div>
                        )}

                        {authError && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                                {authError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                        >
                            {isLoading
                                ? 'PLEASE WAIT...'
                                : pendingEmailOtp
                                    ? 'VERIFY OTP'
                                    : isSignup
                                        ? 'CREATE ACCOUNT'
                                        : 'LOG IN'}
                        </button>
                    </form>

                    {/* Toggle */}
                    {!pendingEmailOtp && (
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
                    )}
                </div>
            </div>
        </>
    );
}
