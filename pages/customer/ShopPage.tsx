import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { useCart, Currency } from '../../contexts/CartContext';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import { getProducts, getCategories } from '../../services/supabase';
import { Product, Category } from '../../types';
import catSpicesTea from '../../src/assets/categories/spices-tea.jpg';
import catFoodSnacks from '../../src/assets/categories/food-snacks.jpg';
import catHandicrafts from '../../src/assets/categories/handicrafts-art.jpg';
import catAyurvedic from '../../src/assets/categories/ayurvedic-herbal.jpg';
import catJaffna from '../../src/assets/categories/jaffna-traditional.jpg';
import catPalm from '../../src/assets/categories/palm-traditional.jpg';
import catHomemade from '../../src/assets/categories/homemade-products.jpg';
import catHealth from '../../src/assets/categories/health-wellness.jpg';
import catApparel from '../../src/assets/categories/apparel-textile.jpg';
import promoSpices from '../../src/assets/shop/promo-spices.jpg';
import promoMasks from '../../src/assets/shop/promo-masks.jpg';
import promoTea from '../../src/assets/shop/promo-tea.jpg';

// Custom hook for scroll animations
const useScrollAnimation = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1, ...options });

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible] as const;
};


const PromotionalCarousel: React.FC = () => {
    const slides = [
        { title: "Weekly Spice Offer!", subtitle: "Get 15% off on all cinnamon products.", image: promoSpices, link: "/shop" },
        { title: "New Handicraft Arrivals", subtitle: "Discover unique, handcrafted masks and sculptures.", image: promoMasks, link: "/shop" },
        { title: "Ceylon Tea Special", subtitle: "Buy two packs and get one free.", image: promoTea, link: "/shop" }
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const [ref, isVisible] = useScrollAnimation<HTMLElement>();

    return (
        <section ref={ref} className={`relative w-full h-52 sm:h-72 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-6 sm:mb-12 transition-opacity duration-700 ${isVisible ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
            {slides.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center text-white p-3 sm:p-4">
                        <h3 className="text-xl sm:text-3xl lg:text-5xl font-serif font-bold">{slide.title}</h3>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-lg lg:text-xl max-w-lg">{slide.subtitle}</p>
                        <a href={slide.link} className="mt-3 sm:mt-6 bg-primary text-white font-bold py-2 px-5 sm:py-3 sm:px-8 text-sm sm:text-base rounded-full hover:bg-primary-600 transition-colors">Shop Now</a>
                    </div>
                </div>
            ))}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}></button>
                ))}
            </div>
        </section>
    );
};

const CulturalAnimationDivider: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.5 });
    return (
        <div ref={ref} className="flex justify-center items-center my-16 h-12" aria-hidden="true">
            <div className={`cultural-divider ${isVisible ? 'animate' : ''}`}>
                <svg width="200" height="50" viewBox="0 0 200 50">
                    <line x1="0" y1="25" x2="80" y2="25" stroke="#d1d5db" strokeWidth="1" className="line line-left" />
                    <line x1="200" y1="25" x2="120" y2="25" stroke="#d1d5db" strokeWidth="1" className="line line-right" />
                    <g className="center-motif" style={{transformOrigin: '100px 25px'}}>
                        <circle cx="100" cy="25" r="14" stroke="#f97316" strokeWidth="1.5" fill="none"/>
                        <circle cx="100" cy="25" r="5" fill="#f97316"/>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                            <line
                                key={angle}
                                x1="109" y1="25" x2="113" y2="25"
                                stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"
                                style={{transformOrigin: '100px 25px'}}
                                transform={`rotate(${angle})`}
                            />
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const [ref, isVisible] = useScrollAnimation<HTMLElement>();
    return (
        <section ref={ref} className={`transition-opacity duration-700 ${className} ${isVisible ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
            {children}
        </section>
    );
};

const categoryPlaceholders: { [key: string]: string } = {
    "Spices & Tea": catSpicesTea,
    "Food & Snacks": catFoodSnacks,
    "Handicrafts & Art": catHandicrafts,
    "Ayurvedic & Herbal": catAyurvedic,
    "Jaffna Traditional": catJaffna,
    "Palm Traditional": catPalm,
    "Homemade Products": catHomemade,
    "Health & Wellness": catHealth,
    "Apparel & Textile": catApparel,
};

const currencies: Currency[] = ['LKR', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'JPY', 'INR', 'SGD', 'AED', 'CHF', 'NZD', 'SEK', 'NOK'];

const MobileCurrencyToggle: React.FC = () => {
    const { currency, setCurrency } = useCart();
    return (
        <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="text-[11px] font-semibold border border-emerald-200 rounded-full px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-800 cursor-pointer focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
            title="Switch currency"
        >
            {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
            ))}
        </select>
    );
};

const ShopPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return {
            category: params.get('category') || '',
            search: params.get('search') || ''
        };
    });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([ getProducts(), getCategories() ]);
                setAllProducts(productsData);
                setCategories([{ id: '', name: 'All Categories', created_at: '' }, ...categoriesData]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            const params = new URLSearchParams(window.location.search);
            setFilters({
                category: params.get('category') || '',
                search: params.get('search') || ''
            });
             window.scrollTo(0, 0);
        };
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const categoryMatch = filters.category ? product.category_id === filters.category : true;
            const searchMatch = filters.search ? product.name.toLowerCase().includes(filters.search.toLowerCase()) : true;
            return categoryMatch && searchMatch;
        });
    }, [allProducts, filters]);

    const handleCategoryChange = (categoryId: string) => {
        const nextPath = categoryId ? `/shop?category=${categoryId}` : '/shop';
        const currentPath = `${window.location.pathname}${window.location.search}`;

        if (currentPath === nextPath) {
             window.scrollTo(0, 0);
        } else {
            window.history.pushState({}, '', nextPath);
            setFilters({
                category: categoryId,
                search: ''
            });
            window.scrollTo(0, 0);
        }
    };
    
    const currentCategoryName = filters.category
        ? (categories.find(c => c.id === filters.category)?.name || 'Select category')
        : 'Select category';

    const renderFilteredView = () => (
        <AnimatedSection>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-3xl font-serif font-bold text-gray-800">
                    {filters.search ? `Searching for "${filters.search}"` : currentCategoryName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">{filteredProducts.length} products found.</p>
            </div>
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-xl sm:text-2xl text-gray-600">No products found.</h2>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">Try adjusting your search or filter.</p>
                </div>
            )}
        </AnimatedSection>
    );

    const renderFullShopExperience = () => {
        const bestsellers = allProducts.slice(0, 4);
        const newArrivals = allProducts.slice(4, 8);
        const visibleCategories = categories.filter(c => c.id).slice(0, 4);

        return (
            <div className="space-y-6 sm:space-y-12">
                <PromotionalCarousel />
                
                {/* Featured Categories */}
                <AnimatedSection>
                    <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-800 text-center mb-4 sm:mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                        {visibleCategories.map(cat => (
                            <a href={`/shop?category=${cat.id}`} key={cat.id} className="relative rounded-lg overflow-hidden shadow-md group h-28 sm:h-48 block">
                                <img src={categoryPlaceholders[cat.name] || `https://picsum.photos/seed/${cat.id}/400/300`} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
                                    <h3 className="text-white text-sm sm:text-2xl font-semibold text-center">{cat.name}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </AnimatedSection>
                
                <CulturalAnimationDivider />
                
                {/* Bestsellers */}
                {bestsellers.length > 0 && (
                    <AnimatedSection>
                        <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-800 text-center mb-4 sm:mb-8">Our Bestsellers</h2>
                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            {bestsellers.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </AnimatedSection>
                )}

                {/* Mid-page Promo Banner */}
                <AnimatedSection>
                     <div className="bg-orange-100 rounded-lg p-5 sm:p-10 text-center flex flex-col items-center">
                        <h3 className="text-lg sm:text-3xl font-serif font-bold text-primary-700">Authentic Products, Straight From Sri Lanka</h3>
                        <p className="text-gray-700 mt-2 max-w-xl text-sm sm:text-base">Browse our curated selection of traditional Sri Lankan goods — spices, teas, handicrafts, and more.</p>
                        <a href={`/shop?category=${categories.find(c=>c.name === 'Spices & Tea')?.id || ''}`} className="mt-4 sm:mt-6 bg-primary text-white font-bold py-2 px-5 sm:px-6 text-sm sm:text-base rounded-full hover:bg-primary-600 transition-colors">Explore Spices & Tea</a>
                    </div>
                </AnimatedSection>

                {/* New Arrivals */}
                 {newArrivals.length > 0 && (
                    <AnimatedSection>
                        <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-800 text-center mb-4 sm:mb-8">New Arrivals</h2>
                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            {newArrivals.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </AnimatedSection>
                )}
            </div>
        );
    }

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><Spinner /></div>;
        }

        if (filters.category || filters.search) {
            return renderFilteredView();
        }
        
        if (allProducts.length > 0) {
            return renderFullShopExperience();
        }
        
        return (
             <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                <h2 className="text-2xl text-gray-600">Our shop is currently empty.</h2>
                <p className="text-gray-500 mt-2">Please check back later for new arrivals!</p>
            </div>
        );
    };

    const [showCategorySheet, setShowCategorySheet] = useState(false);

    const handleMobileCategorySelect = (categoryId: string) => {
        handleCategoryChange(categoryId);
        setShowCategorySheet(false);
    };

    const categoryList = (onSelect: (id: string) => void) => (
        <ul className="space-y-2">
            {categories.map(category => (
                <li key={category.id}>
                    <button
                        onClick={() => onSelect(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${filters.category === category.id ? 'bg-orange-500 text-white shadow-sm border-l-4 border-orange-700' : 'text-gray-700 hover:bg-orange-100'}`}
                    >
                        {category.name}
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="bg-orange-50/30">
            {/* Mobile sticky filter bar */}
            <div className="lg:hidden sticky top-16 z-10 bg-white shadow-sm border-b">
                <div className="flex items-center justify-between px-4 py-2.5">
                    <button
                        onClick={() => setShowCategorySheet(true)}
                        className="flex items-center gap-1 text-orange-800 font-medium bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5 hover:bg-orange-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                        <span className="text-sm">{currentCategoryName}</span>
                        <FiChevronDown className="w-4 h-4 text-orange-500" />
                    </button>
                    <MobileCurrencyToggle />
                </div>
            </div>

            {/* Mobile bottom sheet */}
            {showCategorySheet && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity"
                        onClick={() => setShowCategorySheet(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
                            <button onClick={() => setShowCategorySheet(false)} className="p-1 text-gray-500 hover:text-gray-800">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        {categoryList(handleMobileCategorySelect)}
                    </div>
                </div>
            )}

            <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Desktop sidebar - hidden on mobile */}
                    <aside className="hidden lg:block w-full lg:w-1/4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border sticky top-24">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
                            {categoryList(handleCategoryChange)}
                        </div>
                    </aside>

                    <main className="w-full lg:w-3/4 min-h-[60vh]">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
