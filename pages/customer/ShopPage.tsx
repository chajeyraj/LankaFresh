import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import { getProducts, getCategories } from '../../services/supabase';
import { Product, Category } from '../../types';

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
        { title: "Weekly Spice Offer!", subtitle: "Get 15% off on all cinnamon products.", image: "https://picsum.photos/seed/sri-lankan-spices-offer/1200/500", link: "#/shop" },
        { title: "New Handicraft Arrivals", subtitle: "Discover unique, handcrafted masks and sculptures.", image: "https://picsum.photos/seed/sri-lankan-masks-sale/1200/500", link: "#/shop" },
        { title: "Ceylon Tea Special", subtitle: "Buy two packs and get one free.", image: "https://picsum.photos/seed/ceylon-tea-promo/1200/500", link: "#/shop" }
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
        <section ref={ref} className={`relative w-full h-96 rounded-lg overflow-hidden shadow-lg mb-12 transition-opacity duration-700 ${isVisible ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
            {slides.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center text-white p-4">
                        <h3 className="text-4xl lg:text-5xl font-serif font-bold">{slide.title}</h3>
                        <p className="mt-2 text-lg lg:text-xl max-w-lg">{slide.subtitle}</p>
                        <a href={slide.link} className="mt-6 bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors">Shop Now</a>
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
    "Spices & Herbs": "https://picsum.photos/seed/spices-banner/400/300",
    "Tea & Coffee": "https://picsum.photos/seed/tea-banner/400/300",
    "Handicrafts": "https://picsum.photos/seed/handicrafts-banner/400/300",
    "Sweets & Snacks": "https://picsum.photos/seed/sweets-banner/400/300",
};


const ShopPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
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
        const handleHashChange = () => {
            const params = new URLSearchParams(window.location.hash.split('?')[1]);
            setFilters({
                category: params.get('category') || '',
                search: params.get('search') || ''
            });
             window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const categoryMatch = filters.category ? product.category_id === filters.category : true;
            const searchMatch = filters.search ? product.name.toLowerCase().includes(filters.search.toLowerCase()) : true;
            return categoryMatch && searchMatch;
        });
    }, [allProducts, filters]);

    const handleCategoryChange = (categoryId: string) => {
        const newHash = categoryId ? `/shop?category=${categoryId}` : '/shop';
        if (window.location.hash.substring(1) === newHash) {
             window.scrollTo(0, 0);
        } else {
            window.location.hash = newHash;
        }
    };
    
    const currentCategoryName = categories.find(c => c.id === filters.category)?.name || 'All Products';

    const renderFilteredView = () => (
        <AnimatedSection>
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800">
                    {filters.search ? `Searching for "${filters.search}"` : currentCategoryName}
                </h1>
                <p className="text-gray-600 mt-1">{filteredProducts.length} products found.</p>
            </div>
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-2xl text-gray-600">No products found.</h2>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filter.</p>
                </div>
            )}
        </AnimatedSection>
    );

    const renderFullShopExperience = () => {
        const bestsellers = allProducts.slice(0, 4);
        const newArrivals = allProducts.slice(4, 8);
        const visibleCategories = categories.filter(c => c.id).slice(0, 4);

        return (
            <div className="space-y-12">
                <PromotionalCarousel />
                
                {/* Featured Categories */}
                <AnimatedSection>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {visibleCategories.map(cat => (
                            <a href={`#/shop?category=${cat.id}`} key={cat.id} className="relative rounded-lg overflow-hidden shadow-md group h-48 block">
                                <img src={categoryPlaceholders[cat.name] || `https://picsum.photos/seed/${cat.id}/400/300`} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <h3 className="text-white text-2xl font-semibold text-center">{cat.name}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </AnimatedSection>
                
                <CulturalAnimationDivider />
                
                {/* Bestsellers */}
                {bestsellers.length > 0 && (
                    <AnimatedSection>
                        <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-8">Our Bestsellers</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {bestsellers.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </AnimatedSection>
                )}

                {/* Mid-page Promo Banner */}
                <AnimatedSection>
                     <div className="bg-orange-100 rounded-lg p-10 text-center flex flex-col items-center">
                        <h3 className="text-3xl font-serif font-bold text-primary-700">Authentic Spices, Straight From the Source</h3>
                        <p className="text-gray-700 mt-2 max-w-xl">Elevate your cooking with our hand-selected, premium spices from the gardens of Sri Lanka.</p>
                        <a href={`#/shop?category=${categories.find(c=>c.name === 'Spices & Herbs')?.id || ''}`} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-600 transition-colors">Explore Spices</a>
                    </div>
                </AnimatedSection>

                {/* New Arrivals */}
                 {newArrivals.length > 0 && (
                    <AnimatedSection>
                        <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-8">New Arrivals</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

    return (
        <div className="bg-orange-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="w-full lg:w-1/4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border sticky top-24">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => handleCategoryChange(category.id)}
                                            className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${filters.category === category.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-orange-100'}`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
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