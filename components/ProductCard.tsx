
import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group transition-shadow hover:shadow-lg flex flex-col">
            <a href={`#/product/${product.id}`} className="block overflow-hidden">
                <img className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" src={product.image_url || 'https://picsum.photos/400/300'} alt={product.name} />
            </a>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-gray-500 text-xs uppercase tracking-wide">{product.categories.name}</p>
                {product.origin && <p className="text-gray-400 text-xs mt-1">From {product.origin}</p>}
                <h3 className="text-md font-semibold text-gray-800 mt-1 flex-grow">
                    <a href={`#/product/${product.id}`} className="hover:text-primary-600">{product.name}</a>
                </h3>
                <div className="mt-2">
                    <p className="text-lg font-bold text-gray-900">LKR {product.price_lkr.toFixed(2)}</p>
                </div>
                 <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full mt-3 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-600 transition-colors duration-300"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;