
import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();

    return (
        <div className="container mx-auto px-6 py-8 flex-grow">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-2xl text-gray-600">Your cart is empty.</h2>
                    <a href="#/shop" className="mt-4 inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors">Continue Shopping</a>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                        <div className="divide-y divide-gray-200">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.product.image_url} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{item.product.name}</h3>
                                        <p className="text-gray-600">LKR {item.product.price_lkr.toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 text-sm mt-1">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.product.id, Math.max(1, parseInt(e.target.value, 10)))}
                                        min="1"
                                        className="w-20 p-2 border rounded text-center"
                                    />
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                        <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>LKR {totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-gray-500">Calculated later</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg mb-6 border-t pt-4">
                            <span>Total</span>
                            <span>LKR {totalAmount.toFixed(2)}</span>
                        </div>
                        <a href="#/checkout" className="w-full text-center block bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-600 transition-colors">
                            Proceed to Checkout
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;