'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { loginApi, meApi, registerApi } from '@/lib/api/authApi';
import { clearStoredUser, clearToken, getStoredUser, getToken, setStoredUser, setToken } from '@/lib/api/storage';

interface User {
    _id?: string;
    id: string;
    name: string;
    email: string;
    role?: 'customer' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoginOpen: boolean;
    isSignup: boolean;
    isLoading: boolean;
    authError: string | null;
    openLogin: () => void;
    openSignup: () => void;
    closeAuth: () => void;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    clearError: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getStoredUser<User>());
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        async function restoreSession() {
            const token = getToken();
            if (!token) return;

            try {
                const me = await meApi();
                const normalizedUser: User = {
                    ...me,
                    id: me.id || me._id || '',
                };
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

    const openLogin = useCallback(() => { setAuthError(null); setIsSignup(false); setIsLoginOpen(true); }, []);
    const openSignup = useCallback(() => { setAuthError(null); setIsSignup(true); setIsLoginOpen(true); }, []);
    const closeAuth = useCallback(() => setIsLoginOpen(false), []);
    const clearError = useCallback(() => setAuthError(null), []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const data = await loginApi({ email, password });
            const normalizedUser: User = {
                ...data.user,
                id: data.user.id || data.user._id || '',
            };
            setToken(data.token);
            setStoredUser(normalizedUser);
            setUser(normalizedUser);
            setIsLoginOpen(false);
            return true;
        } catch (error: unknown) {
            setAuthError(error instanceof Error ? error.message : 'Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const data = await registerApi({ name, email, password });
            const normalizedUser: User = {
                ...data.user,
                id: data.user.id || data.user._id || '',
            };
            setToken(data.token);
            setStoredUser(normalizedUser);
            setUser(normalizedUser);
            setIsLoginOpen(false);
            return true;
        } catch (error: unknown) {
            setAuthError(error instanceof Error ? error.message : 'Signup failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        clearToken();
        clearStoredUser();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoginOpen, isSignup, isLoading, authError, openLogin, openSignup, closeAuth, login, signup, clearError, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
