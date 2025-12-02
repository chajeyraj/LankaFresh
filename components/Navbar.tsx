import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const CartIcon: React.FC = () => {
    const { cartCount } = useCart();
    return (
        <a href="#/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                </span>
            )}
        </a>
    );
};

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.hash = `#/shop?search=${encodeURIComponent(searchTerm.trim())}`;
        }
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <div className="bg-primary-700 text-white text-sm text-center py-2 px-4 font-medium shadow-inner">
                <p>After New Year 2026, the first 15 customers will get a 15% discount.</p>
            </div>
            {/* The header background is changed to a warm, subtle orange tint to move away from stark white. */}
            <header className="bg-orange-50 shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo + Brand */}
                        <div className="flex-shrink-0">
                                <a
                                    href="#/"
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

                        {/* Desktop Search Bar */}
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
                        
                        {/* Desktop Menu & Cart */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#/shop" className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                Shop
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <a href="#/about" className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                About Us
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <a href="#/contact" className="text-gray-600 hover:text-primary font-medium transition-colors relative group py-2">
                                Contact
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                            </a>
                            <CartIcon />
                        </div>

                        {/* Mobile Menu Button & Cart */}
                        <div className="md:hidden flex items-center space-x-4">
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

                {/* Mobile Menu */}
                {/* The mobile menu background is updated to match the header, with a complementary border color. */}
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
                            <a href="#/" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>Home</a>
                            <a href="#/shop" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>Shop</a>
                            <a href="#/about" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>About Us</a>
                            <a href="#/contact" className="px-4 py-2 text-gray-600 hover:bg-orange-100" onClick={handleLinkClick}>Contact</a>
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;
