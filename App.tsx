
import React, { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/customer/HomePage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import ContactPage from './pages/customer/ContactPage';
import AboutPage from './pages/customer/AboutPage';
import SupplyChainPage from './pages/customer/SupplyChainPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import ContactMessagesPage from './pages/admin/ContactMessagesPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { supabaseUrl, supabaseAnonKey } from './services/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const PageWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
    </>
);

const App: React.FC = () => {
    const [route, setRoute] = useState(`${window.location.pathname}${window.location.search}`);
    
    // Check for Supabase configuration
    if (!supabaseUrl || !supabaseAnonKey) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-50 text-red-900">
                <div className="text-center p-8 bg-white shadow-lg rounded-lg border border-red-200 max-w-lg">
                    <h1 className="text-2xl font-bold">Application Configuration Error</h1>
                    <p className="mt-4">
                        The Supabase URL and Anonymous Key are missing. The application cannot connect to the database.
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                        Please ensure the <code className="bg-red-100 p-1 rounded font-mono">SUPABASE_URL</code> and <code className="bg-red-100 p-1 rounded font-mono">SUPABASE_ANON_KEY</code> environment variables are set correctly.
                    </p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const handleRouteChange = () => {
            setRoute(`${window.location.pathname}${window.location.search}`);
        };

        window.addEventListener('popstate', handleRouteChange);
        handleRouteChange();

        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    const renderPage = () => {
        const fullPath = route || '/';
        const path = fullPath.split('?')[0];
        
        // Customer Routes
        if (path === '/') return <PageWrapper><HomePage /></PageWrapper>;
        if (path === '/shop') return <PageWrapper><ShopPage /></PageWrapper>;
        if (path.startsWith('/product/')) {
            const id = path.split('/')[2];
            return <PageWrapper><ProductDetailsPage id={id} /></PageWrapper>;
        }
        if (path === '/cart') return <PageWrapper><CartPage /></PageWrapper>;
        if (path === '/checkout') return <PageWrapper><CheckoutPage /></PageWrapper>;
        if (path.startsWith('/order-confirmation')) {
            const urlParams = new URLSearchParams(fullPath.split('?')[1]);
            return <PageWrapper><OrderConfirmationPage orderId={urlParams.get('id')} /></PageWrapper>;
        }
        if (path === '/contact') return <PageWrapper><ContactPage /></PageWrapper>;
        if (path === '/about') return <PageWrapper><AboutPage /></PageWrapper>;
        if (path === '/supply-chain') return <PageWrapper><SupplyChainPage /></PageWrapper>;

        // Admin Routes
        if (path === '/admin/login') return <><Navbar /><main className="flex-grow"><AdminLoginPage /></main></>;
        if (path === '/admin' || path === '/admin/dashboard') return <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>;
        if (path === '/admin/products') return <ProtectedRoute><ProductManagementPage /></ProtectedRoute>;
        if (path === '/admin/categories') return <ProtectedRoute><CategoryManagementPage /></ProtectedRoute>;
        if (path === '/admin/orders') return <ProtectedRoute><OrderManagementPage /></ProtectedRoute>;
        if (path === '/admin/customers') return <ProtectedRoute><CustomerManagementPage /></ProtectedRoute>;
        if (path === '/admin/messages') return <ProtectedRoute><ContactMessagesPage /></ProtectedRoute>;

        return <div className="text-center p-8"><h2>404: Page Not Found</h2><a href="/" className="text-blue-500">Go Home</a></div>;
    };

    return (
        <AuthProvider>
            <CartProvider>
                <div className="flex flex-col min-h-screen bg-gray-50">
                    {renderPage()}
                </div>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
