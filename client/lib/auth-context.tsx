'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    totalTokensUsed?: number;
    dailyTokensUsed?: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, name: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateTokens: (tokensUsed: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get('/api/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiClient.post('/api/auth/login', {
            email,
            password,
        });
        setUser(response.data);
    };

    const signup = async (email: string, name: string, password: string) => {
        const response = await apiClient.post('/api/auth/signup', {
            email,
            name,
            password,
        });
        setUser(response.data);
    };

    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        setUser(null);
    };

    const updateTokens = (tokensUsed: number) => {
        if (user) {
            setUser({
                ...user,
                totalTokensUsed: (user.totalTokensUsed || 0) + tokensUsed,
                dailyTokensUsed: (user.dailyTokensUsed || 0) + tokensUsed,
            });
        } else {
            // If no user, still refresh to get latest data
            checkAuth();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                checkAuth,
                updateTokens,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
