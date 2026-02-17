import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, formatPrice } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group transition-shadow hover:shadow-lg flex flex-col">
            <a href={`/product/${product.id}`} className="block overflow-hidden">
                <img className="w-full h-36 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300" src={product.image_url || 'https://picsum.photos/400/300'} alt={product.name} />
            </a>
            <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wide">{product.categories?.name || 'Uncategorized'}</p>
                {product.origin && <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">From {product.origin}</p>}
                <h3 className="text-xs sm:text-md font-semibold text-gray-800 mt-0.5 sm:mt-1 flex-grow line-clamp-2">
                    <a href={`/product/${product.id}`} className="hover:text-primary-600">{product.name}</a>
                </h3>
                {product.weight_grams && <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{product.weight_grams}g</p>}
                <div className="mt-1.5 sm:mt-2">
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{formatPrice(product.price_lkr, product.price_usd)}</p>
                </div>
                 <button
                    onClick={handleAddToCart}
                    disabled={added}
                    style={{ backgroundColor: added ? '#16a34a' : '#f97316', color: '#ffffff' }}
                    className={`w-full mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${added ? 'scale-95' : 'hover:opacity-90'}`}
                >
                    {added ? 'Added!' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
