
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
import TestimonialManagementPage from './pages/admin/TestimonialManagementPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { supabaseUrl, supabaseAnonKey } from './services/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const BASE_URL = 'https://lankadrop.com';
const DEFAULT_TITLE = 'Lanka Drop | Authentic Sri Lankan Goods Delivered Worldwide';
const DEFAULT_DESCRIPTION = 'Shop authentic Sri Lankan groceries, spices, tea, snacks, and cultural products with worldwide delivery.';

const ensureMetaTag = (selector: string, attributes: Record<string, string>) => {
    let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!tag) {
        tag = document.createElement('meta');
        if (attributes.name) tag.setAttribute('name', attributes.name);
        if (attributes.property) tag.setAttribute('property', attributes.property);
        document.head.appendChild(tag);
    }
    if (attributes.content) tag.setAttribute('content', attributes.content);
};

const setCanonical = (href: string) => {
    let canonical = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);
};

const applySeoForRoute = (fullPath: string) => {
    const path = (fullPath || '/').split('?')[0];
    const url = new URL(fullPath || '/', BASE_URL).toString();

    const seoByRoute: Record<string, { title: string; description: string; robots?: string }> = {
        '/': {
            title: 'Lanka Drop | Authentic Sri Lankan Goods Delivered Worldwide',
            description: 'Discover authentic Sri Lankan groceries, spices, Ceylon tea, snacks, and handmade products with worldwide delivery.',
        },
        '/shop': {
            title: 'Shop Sri Lankan Products | Lanka Drop',
            description: 'Browse Sri Lankan spices, tea, snacks, palm products, handicrafts, and more. Order online with international delivery.',
        },
        '/about': {
            title: 'About Lanka Drop | Sri Lankan Heritage Marketplace',
            description: 'Learn how Lanka Drop connects global customers with authentic Sri Lankan products and transparent sourcing.',
        },
        '/contact': {
            title: 'Contact Lanka Drop | Customer Support',
            description: 'Get in touch with Lanka Drop for order support, product questions, and partnership inquiries.',
        },
        '/supply-chain': {
            title: 'Supply Chain | Lanka Drop',
            description: 'Explore Lanka Drop’s transparent supply chain from Sri Lankan producers to worldwide customers.',
        },
        '/cart': {
            title: 'Your Cart | Lanka Drop',
            description: 'Review selected Sri Lankan products in your cart before checkout.',
            robots: 'noindex,follow',
        },
        '/checkout': {
            title: 'Checkout | Lanka Drop',
            description: 'Securely complete your Lanka Drop order and confirm worldwide delivery details.',
            robots: 'noindex,nofollow',
        },
    };

    let seo = seoByRoute[path];

    if (path.startsWith('/product/')) {
        seo = {
            title: 'Product Details | Lanka Drop',
            description: 'View product details, pricing, and cultural highlights for authentic Sri Lankan goods.',
        };
    }

    if (path.startsWith('/order-confirmation') || path.startsWith('/admin')) {
        seo = {
            title: path.startsWith('/admin') ? 'Admin | Lanka Drop' : 'Order Confirmation | Lanka Drop',
            description: path.startsWith('/admin')
                ? 'Lanka Drop admin area.'
                : 'Your Lanka Drop order confirmation details.',
            robots: 'noindex,nofollow',
        };
    }

    const finalSeo = seo || { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, robots: 'noindex,follow' };

    document.title = finalSeo.title;
    setCanonical(url);

    ensureMetaTag("meta[name='description']", { name: 'description', content: finalSeo.description });
    ensureMetaTag("meta[name='robots']", { name: 'robots', content: finalSeo.robots || 'index,follow' });
    ensureMetaTag("meta[property='og:title']", { property: 'og:title', content: finalSeo.title });
    ensureMetaTag("meta[property='og:description']", { property: 'og:description', content: finalSeo.description });
    ensureMetaTag("meta[property='og:url']", { property: 'og:url', content: url });
    ensureMetaTag("meta[name='twitter:title']", { name: 'twitter:title', content: finalSeo.title });
    ensureMetaTag("meta[name='twitter:description']", { name: 'twitter:description', content: finalSeo.description });
};

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

    useEffect(() => {
        applySeoForRoute(route);
    }, [route]);

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
        if (path === '/admin/testimonials') return <ProtectedRoute><TestimonialManagementPage /></ProtectedRoute>;
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
