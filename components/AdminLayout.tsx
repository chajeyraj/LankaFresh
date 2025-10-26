
import React from 'react';
import { signOut } from '../services/supabase';

const AdminLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    
    const handleSignOut = async () => {
        await signOut();
        window.location.hash = '/admin/login';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
                    <a href="#/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-700">Orders</a>
                    <a href="#/admin/products" className="block px-4 py-2 rounded hover:bg-gray-700">Products</a>
                    <a href="#/admin/categories" className="block px-4 py-2 rounded hover:bg-gray-700">Categories</a>
                    <a href="#/admin/customers" className="block px-4 py-2 rounded hover:bg-gray-700">Customers</a>
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
