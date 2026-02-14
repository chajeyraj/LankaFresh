import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../services/supabase';

const CheckoutPage: React.FC = () => {
    const { cartItems, totalAmount, clearCart, currencySymbol, formatPrice } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        whatsapp_number: '',
        country: '',
        delivery_address: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.whatsapp_number || !formData.country) {
            setError('Please fill in all required fields.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const newOrder = await createOrder(formData, cartItems);
            clearCart();
            window.history.pushState({}, '', `/order-confirmation?id=${newOrder.id}`);
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center p-8 flex-grow">
                <h2 className="text-2xl">Your cart is empty.</h2>
                <a href="/shop" className="text-primary-600 hover:underline">Go to shop</a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-4 sm:mb-6 text-center">Checkout</h1>
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 items-start">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-lg shadow-sm border w-full">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Contact and Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="name" className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="whatsapp_number" className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">WhatsApp Number *</label>
                                <input
                                    type="tel"
                                    name="whatsapp_number"
                                    id="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="country" className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">Country *</label>
                            <input
                                type="text"
                                name="country"
                                id="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label htmlFor="delivery_address" className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">Delivery Address (Optional)</label>
                            <textarea
                                name="delivery_address"
                                id="delivery_address"
                                value={formData.delivery_address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">Order Notes (Optional)</label>
                            <textarea
                                name="notes"
                                id="notes"
                                placeholder="Any special instructions for your order..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="pt-2 sm:pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                                <span className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                                    Secure Checkout
                                </span>
                                <span className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800">
                                    Fast Delivery
                                </span>
                                <span className="inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                                    Money-back Guarantee
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">We will confirm your order and arrange payment via WhatsApp. By placing this order, you agree to be contacted.</p>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ backgroundColor: '#f97316', color: '#ffffff' }}
                                className="w-full font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky lg:top-24 w-full">
                    <h2 className="text-lg sm:text-xl font-semibold border-b pb-3 sm:pb-4 mb-3 sm:mb-4">Your Order</h2>
                    <div className="space-y-3">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                                <span className="font-medium leading-tight break-words">{item.product.name} x {item.quantity}</span>
                                <span className="text-right whitespace-nowrap">{formatPrice(item.product.price_lkr * item.quantity, item.product.price_usd ? item.product.price_usd * item.quantity : null)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-base sm:text-lg mt-4 border-t pt-4">
                        <span>Total</span>
                        <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
