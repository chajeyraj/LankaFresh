
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../services/supabase';

const CheckoutPage: React.FC = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
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
            window.location.hash = `#/order-confirmation?id=${newOrder.id}`;
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center p-8 flex-grow">
                <h2 className="text-2xl">Your cart is empty.</h2>
                <a href="#/shop" className="text-primary-600 hover:underline">Go to shop</a>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-6 py-8 flex-grow">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6 text-center">Checkout</h1>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border">
                    <h2 className="text-2xl font-semibold mb-6">Contact & Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name *</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label htmlFor="whatsapp_number" className="block mb-2 font-medium text-gray-700">WhatsApp Number *</label>
                                <input type="tel" name="whatsapp_number" id="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="country" className="block mb-2 font-medium text-gray-700">Country *</label>
                            <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="delivery_address" className="block mb-2 font-medium text-gray-700">Delivery Address (Optional)</label>
                            <textarea name="delivery_address" id="delivery_address" value={formData.delivery_address} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        <div>
                            <label htmlFor="notes" className="block mb-2 font-medium text-gray-700">Order Notes (Optional)</label>
                            <textarea name="notes" id="notes" placeholder="Any special instructions for your order..." value={formData.notes} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="pt-4">
                            <p className="text-sm text-gray-500 mb-4">By placing this order, you agree to be contacted on WhatsApp to finalize payment and shipping details.</p>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-600 disabled:bg-gray-400 transition-colors">
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                    <h2 className="text-xl font-semibold border-b pb-4 mb-4">Your Order</h2>
                    <div className="space-y-3">
                    {cartItems.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                            <span className="font-medium">{item.product.name} &times; {item.quantity}</span>
                            <span>LKR {(item.product.price_lkr * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
                        <span>Total</span>
                        <span>LKR {totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;