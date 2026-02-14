
import React, { useState, useEffect } from 'react';
import { signIn } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            window.history.pushState({}, '', '/admin/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    }, [session]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            // Redirect is handled by the useEffect
        } catch (err: any) {
            setError(err.message || 'Failed to sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] bg-gradient-to-b from-slate-100 via-slate-50 to-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-slate-200/60">
                <div className="mb-7 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Login</h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to access LankaFresh admin panel</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                        />
                    </div>
                    {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
