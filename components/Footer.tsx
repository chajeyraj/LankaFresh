
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-serif font-bold text-primary">LankaFresh</h3>
                        <p className="mt-4 text-gray-300 text-sm">
                            Your direct link to the tastes and treasures of Sri Lanka, delivered worldwide.
                        </p>
                         <p className="mt-2 text-sm text-gray-400 italic">"From our island, to your home."</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold uppercase tracking-wide">Quick Links</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#/shop" className="text-gray-300 hover:text-white">Shop</a></li>
                            <li><a href="#/about" className="text-gray-300 hover:text-white">About Us</a></li>
                            <li><a href="#/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                            <li><a href="#/supply-chain" className="text-gray-300 hover:text-white">Supply Chain</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold uppercase tracking-wide">Contact Us</h3>
                         <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center">
                                <a href="https://wa.me/94000000000" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">WhatsApp</a>
                            </li>
                             <li className="flex items-center">
                                <a href="mailto:support@lankafresh.com" className="text-gray-300 hover:text-white">support@lankafresh.com</a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Social Media */}
                    <div>
                        <h3 className="font-semibold uppercase tracking-wide">Follow Us</h3>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-300 hover:text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                            </a>
                             <a href="#" className="text-gray-300 hover:text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} LankaFresh. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;