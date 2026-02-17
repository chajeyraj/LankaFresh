
import React from 'react';
import { signOut } from '../services/supabase';

const AdminLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const navigate = (path: string) => {
        if (window.location.pathname === path) return;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };
    
    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    const linkClass = (path: string) => {
        const isActive = window.location.pathname === path;
        return `block px-4 py-2 rounded transition-colors ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="/admin/dashboard" onClick={(e) => handleNavClick(e, '/admin/dashboard')} className={linkClass('/admin/dashboard')}>Dashboard</a>
                    <a href="/admin/orders" onClick={(e) => handleNavClick(e, '/admin/orders')} className={linkClass('/admin/orders')}>Orders</a>
                    <a href="/admin/products" onClick={(e) => handleNavClick(e, '/admin/products')} className={linkClass('/admin/products')}>Products</a>
                    <a href="/admin/categories" onClick={(e) => handleNavClick(e, '/admin/categories')} className={linkClass('/admin/categories')}>Categories</a>
                    <a href="/admin/testimonials" onClick={(e) => handleNavClick(e, '/admin/testimonials')} className={linkClass('/admin/testimonials')}>Testimonials</a>
                    <a href="/admin/customers" onClick={(e) => handleNavClick(e, '/admin/customers')} className={linkClass('/admin/customers')}>Customers</a>
                    <a href="/admin/messages" onClick={(e) => handleNavClick(e, '/admin/messages')} className={linkClass('/admin/messages')}>Messages</a>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow p-4">
                    <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
