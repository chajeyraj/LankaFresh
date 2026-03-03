import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';

const CartIcon: React.FC = () => {
    const { cartCount } = useCart();
    const prevCount = useRef(cartCount);
    const [bounce, setBounce] = useState(false);

    useEffect(() => {
        if (cartCount > prevCount.current) {
            setBounce(true);
            const timer = setTimeout(() => setBounce(false), 600);
            return () => clearTimeout(timer);
        }
        prevCount.current = cartCount;
    }, [cartCount]);

    return (
        <a href="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-transform ${bounce ? 'animate-cart-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
                <span className={`absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${bounce ? 'animate-cart-bounce' : ''}`}>
                    {cartCount}
                </span>
            )}
        </a>
    );
};

const currencyOptions = [
    { code: 'LKR', flag: '🇱🇰', label: 'LKR' },
    { code: 'USD', flag: '🇺🇸', label: 'USD' },
    { code: 'GBP', flag: '🇬🇧', label: 'GBP' },
    { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
    { code: 'CAD', flag: '🇨🇦', label: 'CAD' },
    { code: 'AUD', flag: '🇦🇺', label: 'AUD' },
    { code: 'JPY', flag: '🇯🇵', label: 'JPY' },
    { code: 'INR', flag: '🇮🇳', label: 'INR' },
    { code: 'SGD', flag: '🇸🇬', label: 'SGD' },
    { code: 'AED', flag: '🇦🇪', label: 'AED' },
    { code: 'CHF', flag: '🇨🇭', label: 'CHF' },
    { code: 'NZD', flag: '🇳🇿', label: 'NZD' },
    { code: 'SEK', flag: '🇸🇪', label: 'SEK' },
    { code: 'NOK', flag: '🇳🇴', label: 'NOK' },
] as const;

const CurrencyToggle: React.FC = () => {
    const { currency, setCurrency } = useCart();
    return (
        <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="text-xs font-semibold border border-gray-300 rounded-full px-2 py-1 bg-white hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer focus:ring-primary focus:border-primary"
            title="Switch currency"
        >
            {currencyOptions.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
            ))}
        </select>
    );
};

const Navbar: React.FC = () => {
    const SHOP_ALL_URL = '/shop?category=__all__';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const nextUrl = `/shop?search=${encodeURIComponent(searchTerm.trim())}`;
            window.history.pushState({}, '', nextUrl);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            {!isBannerDismissed && (
                <div className="bg-primary-700 text-white text-center py-2 px-3 pr-10 sm:px-4 font-medium shadow-inner relative">
                    <a href={SHOP_ALL_URL} className="inline-block text-xs leading-snug sm:text-sm sm:leading-normal hover:underline">
                        <span className="block sm:inline">Limited Time: 15% off for the first 15 customers -</span>
                        <span className="block sm:inline font-bold sm:ml-1">Order now!</span>
                    </a>
                    <button onClick={() => setIsBannerDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" aria-label="Dismiss banner">X</button>
                </div>
            )}
            <header className="bg-orange-50 shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                                <a
                                    href="/"
                                    className="flex items-center gap-2"
                                    title="Lanka Drop – Bringing Home the Taste of Lanka"
                                >
                                    <img
                                        src="/logo.png"
                                        alt="Lanka Drop logo"
                                        title="Lanka Drop – Bringing Home the Taste of Lanka"
                                        className="h-12 w-12 object-contain"
                                    />
                                    <span className="text-2xl font-serif font-bold text-primary-600">Lanka Drop</span>
                                </a>
                        </div>

                        <div className="hidden md:block flex-1 max-w-xl mx-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for authentic Sri Lankan products..."
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition bg-white"
                                />
                                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </button>
                            </form>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-6">
                            <a href="/" className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                Home
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <a href={SHOP_ALL_URL} className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                Shop
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <a href="/about" className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                About Us
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <a href="/contact" className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                Contact
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <CurrencyToggle />
                            <CartIcon />
                        </div>

                        <div className="md:hidden flex items-center space-x-3">
                            <button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className="text-gray-600 hover:text-primary focus:outline-none"
                                aria-label="Toggle search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </button>
                            <CartIcon />
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="text-gray-600 hover:text-primary focus:outline-none"
                                aria-label="Toggle menu"
                                aria-expanded={isMenuOpen}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-orange-50 border-t border-orange-100">
                        <div className="p-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-white"
                                />
                            </form>
                        </div>
                        <nav className="flex flex-col pb-4">
                            <div className="px-4 py-3 border-b border-orange-100 mb-2">
                                <a href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                                    <img src="/logo.png" alt="Lanka Drop" className="h-8 w-8 object-contain" />
                                    <span className="text-lg font-serif font-bold text-primary-600">Lanka Drop</span>
                                </a>
                            </div>
                            <a href="/" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>Home</a>
                            <a href={SHOP_ALL_URL} className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>Shop</a>
                            <a href="/about" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>About Us</a>
                            <a href="/contact" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>Contact</a>
                            <div className="px-4 pt-3">
                                <a href={SHOP_ALL_URL} onClick={handleLinkClick} style={{ backgroundColor: '#f97316', color: '#ffffff' }} className="block text-center font-bold py-2.5 rounded-full hover:opacity-90 transition-colors">
                                    Shop Now
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
                {/* Mobile Search Bar */}
                {isMobileSearchOpen && (
                    <div className="md:hidden border-t border-orange-100 bg-orange-50 px-4 py-2">
                        <form onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }} className="relative">
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                autoFocus
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition bg-white text-sm"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </button>
                        </form>
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;

