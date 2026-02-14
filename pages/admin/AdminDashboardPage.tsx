import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
// FIX: Correctly import the getClient function to retrieve the Supabase instance.
import { getClient } from '../../services/supabase';
import { OrderStatus } from '../../types';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState({ products: 0, orders: 0, newOrders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            // FIX: Initialize the Supabase client using the getClient function.
            const supabase = getClient();
            try {
                const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
                const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
                const { count: newOrdersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.Pending);
                
                setStats({
                    products: productsCount || 0,
                    orders: ordersCount || 0,
                    newOrders: newOrdersCount || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: "Total Products", value: stats.products, link: "/admin/products" },
        { title: "Total Orders", value: stats.orders, link: "/admin/orders" },
        { title: "New Orders", value: stats.newOrders, link: "/admin/orders" },
    ];

    const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        if (window.location.pathname === path) return;
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <AdminLayout title="Dashboard">
            {loading ? <p>Loading stats...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map(card => (
                        <a href={card.link} key={card.title} onClick={(e) => handleCardClick(e, card.link)} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                        </a>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboardPage;
