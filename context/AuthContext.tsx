'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoginOpen: boolean;
    isSignup: boolean;
    openLogin: () => void;
    openSignup: () => void;
    closeAuth: () => void;
    login: (email: string, password: string) => void;
    signup: (name: string, email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const openLogin = useCallback(() => { setIsSignup(false); setIsLoginOpen(true); }, []);
    const openSignup = useCallback(() => { setIsSignup(true); setIsLoginOpen(true); }, []);
    const closeAuth = useCallback(() => setIsLoginOpen(false), []);

    const login = useCallback((email: string, _password: string) => {
        // Simulated login
        setUser({ name: email.split('@')[0], email });
        setIsLoginOpen(false);
    }, []);

    const signup = useCallback((name: string, email: string, _password: string) => {
        setUser({ name, email });
        setIsLoginOpen(false);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoginOpen, isSignup, openLogin, openSignup, closeAuth, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
