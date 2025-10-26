import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { onAuthStateChange } from '../services/supabase';
import Spinner from '../components/Spinner';

interface AuthContextType {
    session: Session | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscription = onAuthStateChange(setSession);
        setLoading(false);
        return () => {
            subscription?.unsubscribe();
        };
    }, []);
    
    const value = { session, loading };

    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
    return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
