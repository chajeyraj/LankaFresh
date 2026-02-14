
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

export type Currency = 'LKR' | 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'SGD' | 'AED' | 'CHF' | 'NZD' | 'SEK' | 'NOK';

const USD_RATES: Record<Currency, number> = {
    LKR: 0,
    USD: 1,
    GBP: 0.79,
    EUR: 0.92,
    CAD: 1.36,
    AUD: 1.53,
    JPY: 149.50,
    INR: 83.10,
    SGD: 1.34,
    AED: 3.67,
    CHF: 0.88,
    NZD: 1.64,
    SEK: 10.45,
    NOK: 10.55,
};

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalAmount: number;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (priceLkr: number, priceUsd: number | null | undefined) => string;
    currencySymbol: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    const [currency, setCurrencyState] = useState<Currency>(() => {
        try {
            return (localStorage.getItem('currency') as Currency) || 'LKR';
        } catch {
            return 'LKR';
        }
    });

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('currency', c);
    };

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const getConvertedPrice = (priceLkr: number, priceUsd: number | null | undefined): number => {
        if (currency === 'LKR') return priceLkr;
        if (priceUsd) return priceUsd * USD_RATES[currency];
        return priceLkr;
    };

    const totalAmount = cartItems.reduce((total, item) => {
        return total + getConvertedPrice(item.product.price_lkr, item.product.price_usd) * item.quantity;
    }, 0);

    const CURRENCY_SYMBOLS: Record<Currency, string> = {
        LKR: 'LKR ', USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$',
        JPY: '¥', INR: '₹', SGD: 'S$', AED: 'AED ', CHF: 'CHF ', NZD: 'NZ$',
        SEK: 'SEK ', NOK: 'NOK ',
    };

    const currencySymbol = CURRENCY_SYMBOLS[currency];

    const formatPrice = (priceLkr: number, priceUsd: number | null | undefined): string => {
        if (currency === 'LKR') return `LKR ${priceLkr.toFixed(2)}`;
        if (priceUsd) {
            const converted = priceUsd * USD_RATES[currency];
            const sym = CURRENCY_SYMBOLS[currency];
            return currency === 'JPY' ? `${sym}${Math.round(converted)}` : `${sym}${converted.toFixed(2)}`;
        }
        return `LKR ${priceLkr.toFixed(2)}`;
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalAmount, currency, setCurrency, formatPrice, currencySymbol }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
