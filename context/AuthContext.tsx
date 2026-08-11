'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { loginApi, meApi, registerApi, requestEmailOtpApi, verifyEmailOtpApi } from '@/lib/api/authApi';
import { clearStoredUser, clearToken, getToken, setStoredUser, setToken } from '@/lib/api/storage';

interface User {
    _id?: string;
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    phone?: string;
    role?: 'customer' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoginOpen: boolean;
    isSignup: boolean;
    isLoading: boolean;
    authError: string | null;
    pendingEmailOtp: string | null;
    openLogin: () => void;
    openSignup: () => void;
    closeAuth: () => void;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, phone?: string) => Promise<"otp" | "loggedIn" | "error">;
    requestEmailOtp: (email: string) => Promise<boolean>;
    verifyEmailOtp: (email: string, otp: string) => Promise<boolean>;
    clearPendingEmailOtp: () => void;
    clearError: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // ========== STATE ==========
    const [user, setUser] = useState<User | null>(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [pendingEmailOtp, setPendingEmailOtp] = useState<string | null>(null);

    // ========== HELPER FUNCTIONS ==========
    const normalizeUser = (userData: any): User => ({
        id: userData.id || userData._id || '',
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        phone: userData.phone,
        role: userData.role,
    });

    const setAuthenticatedUser = (userData: any, token: string) => {
        const normalized = normalizeUser(userData);
        setToken(token);
        setStoredUser(normalized);
        setUser(normalized);
    };

    // ========== SESSION RESTORATION ==========
    useEffect(() => {
        async function restoreSession() {
            const token = getToken();
            if (!token) return;

            try {
                const me = await meApi();
                const normalizedUser = normalizeUser(me);
                setUser(normalizedUser);
                setStoredUser(normalizedUser);
            } catch {
                clearToken();
                clearStoredUser();
                setUser(null);
            }
        }

        void restoreSession();
    }, []);

    // ========== MODAL CONTROLS ==========
    const openLogin = useCallback(() => {
        setAuthError(null);
        setPendingEmailOtp(null);
        setIsSignup(false);
        setIsLoginOpen(true);
    }, []);

    const openSignup = useCallback(() => {
        setAuthError(null);
        setPendingEmailOtp(null);
        setIsSignup(true);
        setIsLoginOpen(true);
    }, []);

    const closeAuth = useCallback(() => {
        setIsLoginOpen(false);
    }, []);

    const clearError = useCallback(() => {
        setAuthError(null);
    }, []);

    const clearPendingEmailOtp = useCallback(() => {
        setPendingEmailOtp(null);
    }, []);

    // ========== AUTHENTICATION ACTIONS ==========
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const data = await loginApi({ email, password });
            setAuthenticatedUser(data.user, data.token);
            setIsLoginOpen(false);
            return true;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Login failed';
            setAuthError(message);

            // Handle unverified email case
            if (message.toLowerCase().includes('email not verified')) {
                setPendingEmailOtp(email);
                try {
                    await requestEmailOtpApi(email);
                } catch {
                    // Ignore OTP resend failures; surface primary login error
                }
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (
        name: string,
        email: string,
        password: string,
        phone?: string
    ) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const data = await registerApi({
                name,
                email,
                password,
                phone: phone?.trim() || undefined
            });

            // Check if email verification is required
            if ('requiresEmailOtp' in data) {
                setPendingEmailOtp(data.email);
                return 'otp';
            }

            // User is registered and logged in
            setAuthenticatedUser(data.user, data.token);
            setIsLoginOpen(false);
            return 'loggedIn';
        } catch (error: unknown) {
            setAuthError(error instanceof Error ? error.message : 'Signup failed');
            return 'error';
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========== EMAIL VERIFICATION ==========
    const requestEmailOtp = useCallback(async (email: string) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            await requestEmailOtpApi(email);
            return true;
        } catch (error: unknown) {
            setAuthError(error instanceof Error ? error.message : 'Unable to send OTP');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const verifyEmailOtp = useCallback(async (email: string, otp: string) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const data = await verifyEmailOtpApi({ email, otp });
            setAuthenticatedUser(data.user, data.token);
            setPendingEmailOtp(null);
            setIsLoginOpen(false);
            return true;
        } catch (error: unknown) {
            setAuthError(error instanceof Error ? error.message : 'OTP verification failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========== LOGOUT ==========
    const logout = useCallback(() => {
        clearToken();
        clearStoredUser();
        setUser(null);
    }, []);

    // ========== PROVIDER ==========
    return (
        <AuthContext.Provider
            value={{
                user,
                isLoginOpen,
                isSignup,
                isLoading,
                authError,
                pendingEmailOtp,
                openLogin,
                openSignup,
                closeAuth,
                login,
                signup,
                requestEmailOtp,
                verifyEmailOtp,
                clearPendingEmailOtp,
                clearError,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
