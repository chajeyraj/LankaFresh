import React, { useState } from 'react';
import { supabase } from '../src/integrations/supabase/client';

const NewsletterSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus('loading');
        try {
            const { error } = await supabase
                .from('newsletter_subscribers' as any)
                .insert([{ email: email.trim() }] as any);
            if (error) {
                if (error.code === '23505') {
                    setMessage("You're already subscribed!");
                    setStatus('success');
                } else {
                    throw error;
                }
            } else {
                setMessage('Welcome to the Lanka Drop family! 🎉');
                setStatus('success');
                setEmail('');
            }
        } catch {
            setMessage('Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    return (
        <section className="bg-primary-700 py-16">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-serif font-bold text-white mb-3">Join the Lanka Drop Family</h2>
                <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
                    Get 10% off your first order and be the first to know about new products and exclusive offers.
                </p>
                {status === 'success' ? (
                    <p className="text-white text-lg font-semibold bg-white/20 inline-block px-6 py-3 rounded-full">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="flex-1 px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-white text-primary-700 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                )}
                {status === 'error' && <p className="text-red-200 mt-3 text-sm">{message}</p>}
            </div>
        </section>
    );
};

export default NewsletterSignup;
