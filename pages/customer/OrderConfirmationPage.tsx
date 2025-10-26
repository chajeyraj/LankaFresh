
import React from 'react';

const OrderConfirmationPage: React.FC<{ orderId: string | null }> = ({ orderId }) => {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="bg-white p-12 rounded-lg shadow-xl text-center max-w-2xl w-full">
                <div className="text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Order Received!</h1>
                <p className="text-gray-600 mb-6">Thank you for your purchase. We will contact you via WhatsApp shortly to confirm payment and shipping details.</p>
                {orderId && (
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <p className="text-gray-700">Your Order Reference:</p>
                        <p className="font-mono text-lg font-semibold tracking-wider">{orderId}</p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#/" className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                        Return to Home
                    </a>
                    <a href="#/shop" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                        Continue Shopping
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;