import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/HomePage.module.css';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../services/supabase';
import { Product, Category } from '../../types';
import Spinner from '../../components/Spinner';

// Custom hook for scroll animations (brought in for this page)
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

// Reusable animated section component
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const [ref, isVisible] = useScrollAnimation<HTMLElement>();
    return (
        <section ref={ref} className={`transition-opacity duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
            {children}
        </section>
    );
};

// Kolam-inspired animated divider
const TamilCulturalDivider: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.5 });
    return (
        <div ref={ref} className="flex justify-center items-center my-16 h-12" aria-hidden="true">
            <div className={`cultural-divider ${isVisible ? 'animate' : ''}`}>
                <svg width="250" height="60" viewBox="0 0 250 60">
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#d1d5db" strokeWidth="1" className="line line-left" />
                    <line x1="250" y1="30" x2="150" y2="30" stroke="#d1d5db" strokeWidth="1" className="line line-right" />
                    <g className="center-motif" style={{ transformOrigin: '125px 30px' }}>
                        <path d="M125 15 L135 30 L125 45 L115 30 Z" stroke="#f97316" strokeWidth="1.5" fill="none" />
                        <circle cx="125" cy="30" r="4" fill="#f97316" />
                        <circle cx="125" cy="12" r="2" fill="#f97316" />
                        <circle cx="125" cy="48" r="2" fill="#f97316" />
                        <circle cx="107" cy="30" r="2" fill="#f97316" />
                        <circle cx="143" cy="30" r="2" fill="#f97316" />
                    </g>
                </svg>
            </div>
        </div>
    );
};


const categoryPlaceholders: { [key: string]: string } = {
    "Spices & Herbs": "https://picsum.photos/seed/jaffna-curry-powder/300/300",
    "Tea & Coffee": "https://picsum.photos/seed/northern-herbal-tea/300/300",
    "Handicrafts": "https://picsum.photos/seed/palmyra-leaf-crafts/300/300",
    "Sweets & Snacks": "https://picsum.photos/seed/palmyra-jaggery/300/300",
    "Health & Wellness": "https://picsum.photos/seed/tamil-herbal-remedies/300/300",
    "Apparel & Textiles": "https://picsum.photos/seed/handloom-saree/300/300",
};


const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);
                setFeaturedProducts(productsData.slice(0, 4));
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const greetings = ["வணக்கம்", "Welcome", "ආයුබෝවන්"];
    const [greetIndex, setGreetIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setGreetIndex((i) => (i + 1) % greetings.length);
        }, 2500);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="bg-orange-50/30">
            {/* Hero Section */}
            <section
                className="relative w-full h-[32rem] bg-gray-900 overflow-hidden"
                style={{
                    backgroundImage: 'url(/Background.jpg)', // Place your file as public/Background.jpg
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold animate-fade-in-up">
                            <span
                                key={greetIndex}
                                className={`${styles.greetWord}`}
                            >
                                {greetings[greetIndex]}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>A taste of the Tamil,Sinhala homeland, delivered to you.</p>
                        <a href="#/shop" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Explore Now</a>
                    </div>
                </div>
            </section>
            
            <div className="container mx-auto px-6 py-20">
                {/* Our Heritage Section */}
                <AnimatedSection className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Our Heritage</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed text-justify">
                                Lanka Drop is a celebration of Sri Lanka's rich Tamil culture. We are dedicated to preserving the legacy of our ancestors by bringing you the authentic flavours, crafts, and remedies from the heart of the Tamil homeland—from the vibrant markets of Yalpanam (Jaffna) to the serene villages of the North.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                Each product tells a story, a tradition passed down through generations. We partner with local artisans and family-run farms to ensure every item is not just a product, but a piece of our shared heritage.
                            </p>
                        </div>
                        <div>
                             <img src="https://picsum.photos/seed/tamil-family-cooking/600/500" alt="A family preparing a traditional Tamil meal" className="rounded-lg shadow-xl" />
                        </div>
                    </div>
                </AnimatedSection>
            
                {/* Categories Section */}
                <AnimatedSection>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-10">Explore Our Treasures</h2>
                    {loading ? <Spinner /> : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                            {categories.map(category => (
                                <a href={`#/shop?category=${category.id}`} key={category.id} className="group block text-center">
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-transform group-hover:scale-105 duration-300">
                                       <img src={categoryPlaceholders[category.name] || `https://picsum.photos/seed/${category.id}/300/300`} alt={category.name} className="w-full h-full object-cover"/>
                                    </div>
                                    <p className="mt-4 font-semibold text-gray-700 group-hover:text-primary transition-colors">{category.name}</p>
                                </a>
                            ))}
                        </div>
                    )}
                </AnimatedSection>

                <TamilCulturalDivider />

                 {/* Featured Products Section */}
                <AnimatedSection>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-10">Handpicked Favourites</h2>
                    {loading ? <Spinner /> : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </AnimatedSection>

                <TamilCulturalDivider />

                {/* The Yalpanam Pantry Section */}
                <AnimatedSection className="text-center">
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-10">The Yalpanam Pantry</h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">The soul of our cuisine lies in its unique ingredients, cultivated under the northern sun.</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="relative overflow-hidden rounded-lg shadow-lg">
                                <img src="https://picsum.photos/seed/fiery-jaffna-spices/400/400" alt="Jaffna curry powder" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"/>
                            </div>
                            <h3 className="text-xl font-semibold mt-4">Fiery Jaffna Spices</h3>
                            <p className="text-gray-600 mt-1">A robust blend of sun-dried red chilies and roasted spices.</p>
                        </div>
                        <div className="text-center group">
                            <div className="relative overflow-hidden rounded-lg shadow-lg">
                                <img src="https://picsum.photos/seed/sweet-palmyra-nectar/400/400" alt="Palmyra jaggery" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"/>
                            </div>
                            <h3 className="text-xl font-semibold mt-4">Sweet Palmyra Nectar</h3>
                            <p className="text-gray-600 mt-1">Pure, unrefined jaggery from the treasured Palmyra palm.</p>
                        </div>
                        <div className="text-center group">
                             <div className="relative overflow-hidden rounded-lg shadow-lg">
                                <img src="https://picsum.photos/seed/pickled-mangoes-jaffna/400/400" alt="Pickled Jaffna mangoes" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"/>
                            </div>
                            <h3 className="text-xl font-semibold mt-4">Authentic Pickles</h3>
                            <p className="text-gray-600 mt-1">Tangy, spicy preserves made from local fruits and vegetables.</p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Customer Reviews Section */}
                <AnimatedSection className="mt-20">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-gray-800">What Our Customers Say</h2>
                        <div className="flex space-x-2">
                            <button 
                                className={`${styles.reviewNavBtn} bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const container = document.querySelector('.reviews-container');
                                    container.scrollBy({ left: -300, behavior: 'smooth' });
                                }}
                            >
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                className={`${styles.reviewNavBtn} bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const container = document.querySelector('.reviews-container');
                                    container.scrollBy({ left: 300, behavior: 'smooth' });
                                }}
                            >
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className={`${styles.reviewsContainer} flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide space-x-6`}>
                        {[
                            {
                                name: "Priya K.",
                                location: "Toronto, Canada",
                                rating: 5,
                                comment: "The spices are incredibly fresh and authentic. Tastes just like my grandmother's cooking! Shipping was faster than expected.",
                                avatar: "https://randomuser.me/api/portraits/women/32.jpg"
                            },
                            {
                                name: "Rajesh M.",
                                location: "London, UK",
                                rating: 5,
                                comment: "Finally found a place that delivers genuine Sri Lankan products. The mango pickle is out of this world!",
                                avatar: "https://randomuser.me/api/portraits/men/45.jpg"
                            },
                            {
                                name: "Anjali P.",
                                location: "Sydney, Australia",
                                rating: 5,
                                comment: "Excellent customer service and the products arrived perfectly packed. Will definitely order again!",
                                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
                            },
                            {
                                name: "Kumar S.",
                                location: "New York, USA",
                                rating: 5,
                                comment: "The tea leaves are exceptional quality. Reminds me of home. Will be a returning customer for sure!",
                                avatar: "https://randomuser.me/api/portraits/men/22.jpg"
                            },
                            {
                                name: "Meena R.",
                                location: "Dubai, UAE",
                                rating: 5,
                                comment: "Authentic Sri Lankan flavors delivered right to my doorstep. The packaging was excellent and everything arrived fresh.",
                                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                            }
                        ].map((review, index) => (
                            <div key={index} className="flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center mb-4">
                                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <h4 className="font-semibold">{review.name}</h4>
                                        <p className="text-sm text-gray-500">{review.location}</p>
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default HomePage;
