import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalAmount, currencySymbol, formatPrice } = useCart();

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-xl sm:text-2xl text-gray-600">Your cart is empty.</h2>
                    <a href="/shop" className="mt-4 inline-block bg-primary text-white font-semibold px-6 sm:px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors">Continue Shopping</a>
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 bg-white p-3 sm:p-6 rounded-lg shadow-sm border w-full">
                        <div className="divide-y divide-gray-200">
                            {cartItems.map(item => (
                                <div key={item.product.id} className="py-4">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <img
                                            src={item.product.image_url}
                                            alt={item.product.name}
                                            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-sm sm:text-lg text-gray-800 leading-tight">{item.product.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{formatPrice(item.product.price_lkr, item.product.price_usd)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4 sm:justify-end">
                                        <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-lg font-medium"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center border-x">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-lg font-medium"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky lg:top-24 w-full">
                        <h2 className="text-lg sm:text-xl font-semibold border-b pb-3 sm:pb-4 mb-3 sm:mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-gray-500">Calculated later</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-base sm:text-lg mb-4 sm:mb-6 border-t pt-3 sm:pt-4">
                            <span>Total</span>
                            <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
                        </div>
                        <a href="/checkout" className="w-full text-center block bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-600 transition-colors">
                            Proceed to Checkout
                        </a>
                        <a href="/shop" className="w-full text-center block text-gray-600 hover:text-primary font-medium py-2 mt-2 text-sm">
                            &larr; Continue Shopping
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
