
import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import { getProductById } from '../../services/supabase';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductDetailsPageProps {
  id: string;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ id }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, formatPrice } = useCart();
    
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const productData = await getProductById(id);
                setProduct(productData);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    }

    if (!product) {
        return <div className="text-center p-8"><h2>Product not found</h2><a href="/shop" className="text-blue-500">Back to Shop</a></div>;
    }

    const whatsappLink = `https://wa.me/94000000000?text=${encodeURIComponent(`Hi, I have a question about the product: ${product.name}`)}`;

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <div className="rounded-lg overflow-hidden border">
                        <img src={product.image_url || 'https://picsum.photos/600/600'} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Details Section */}
                    <div>
                        <span className="text-sm font-semibold text-gray-500 uppercase">{product.categories.name}</span>
                        <h1 className="text-4xl font-serif font-bold text-gray-800 mt-2 mb-4">{product.name}</h1>
                        <p className="text-3xl font-semibold text-primary mb-6">{formatPrice(product.price_lkr, product.price_usd)}</p>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 my-6 border-t border-b py-4">
                            {product.origin && (
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Origin: <strong>{product.origin}</strong></span>
                                </div>
                            )}
                            {product.weight_grams && (
                                <div className="flex items-center gap-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    <span>Weight: <strong>{product.weight_grams}g</strong></span>
                                </div>
                            )}
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <label htmlFor="quantity" className="font-semibold text-gray-700">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                                min="1"
                                className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => addToCart(product, quantity)}
                                style={{ backgroundColor: '#f97316', color: '#ffffff' }}
                                className="flex-1 px-8 py-3 font-semibold rounded-lg hover:opacity-90 transition-colors"
                            >
                                Add to Cart
                            </button>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center"
                            >
                                Ask a Question
                            </a>
                        </div>
                    </div>
                </div>

                {product.cultural_significance && (
                    <div className="mt-16 pt-10 border-t">
                        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4 text-center">A Touch of Tradition</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line max-w-3xl mx-auto text-center">{product.cultural_significance}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPage;
