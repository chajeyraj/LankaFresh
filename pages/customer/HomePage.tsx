import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/HomePage.module.css';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../services/supabase';
import { Product, Category } from '../../types';
import Spinner from '../../components/Spinner';
import NewsletterSignup from '../../components/NewsletterSignup';
import catSpicesTea from '../../src/assets/categories/spices-tea.jpg';
import catFoodSnacks from '../../src/assets/categories/food-snacks.jpg';
import catHandicrafts from '../../src/assets/categories/handicrafts-art.jpg';
import catAyurvedic from '../../src/assets/categories/ayurvedic-herbal.jpg';
import catJaffna from '../../src/assets/categories/jaffna-traditional.jpg';
import catPalm from '../../src/assets/categories/palm-traditional.jpg';
import catHomemade from '../../src/assets/categories/homemade-products.jpg';
import catHealth from '../../src/assets/categories/health-wellness.jpg';
import catApparel from '../../src/assets/categories/apparel-textile.jpg';
import heritageCooking from '../../src/assets/heritage-cooking.jpg';
import pantryJaffnaSpices from '../../src/assets/pantry/jaffna-spices.jpg';
import pantryPalmyra from '../../src/assets/pantry/palmyra-nectar.jpg';
import pantryPickles from '../../src/assets/pantry/authentic-pickles.jpg';

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
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, [ref, options]);

    return [ref, isVisible] as const;
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
    const [ref, isVisible] = useScrollAnimation<HTMLElement>();
    return (
        <section
            ref={ref}
            className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </section>
    );
};

// Kolam-inspired animated divider
const KolamDivider: React.FC = () => {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.5 });
    return (
        <div ref={ref} className="flex justify-center items-center my-8 md:my-16" aria-hidden="true">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <svg width="280" height="50" viewBox="0 0 280 50">
                    <line x1="0" y1="25" x2="110" y2="25" stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                    <line x1="170" y1="25" x2="280" y2="25" stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                    <g style={{ transformOrigin: '140px 25px' }}>
                        <path d="M140 5 L155 25 L140 45 L125 25 Z" stroke="#b45309" strokeWidth="1.5" fill="none" />
                        <path d="M140 10 L150 25 L140 40 L130 25 Z" stroke="#ea580c" strokeWidth="1" fill="none" opacity="0.5" />
                        <circle cx="140" cy="25" r="4" fill="#b45309" />
                        <circle cx="140" cy="5" r="2.5" fill="#d97706" />
                        <circle cx="140" cy="45" r="2.5" fill="#d97706" />
                        <circle cx="120" cy="25" r="2.5" fill="#d97706" />
                        <circle cx="160" cy="25" r="2.5" fill="#d97706" />
                        {/* Small decorative dots */}
                        <circle cx="130" cy="15" r="1.5" fill="#ea580c" opacity="0.6" />
                        <circle cx="150" cy="15" r="1.5" fill="#ea580c" opacity="0.6" />
                        <circle cx="130" cy="35" r="1.5" fill="#ea580c" opacity="0.6" />
                        <circle cx="150" cy="35" r="1.5" fill="#ea580c" opacity="0.6" />
                    </g>
                </svg>
            </div>
        </div>
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

const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const reviewsContainerRef = useRef<HTMLDivElement>(null);
    

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

    const slides = [
        { lang: 'ta', title: 'வணக்கம்', subtitle: 'உங்கள் தாய்நாட்டின் உணர்வுகள், அன்புடன் உங்கள் வாசல்வரை. ❤️🌍', ctaText: 'Shop Now', href: '/shop' },
        { lang: 'en', title: 'Welcome', subtitle: 'Homeland vibes, delivered to you with love. ❤️', ctaText: 'Contact Us', href: '/contact' },
        { lang: 'si', title: 'ආයුබෝවන්', subtitle: 'ඔබේ මව් බිම් සුවඳ, ආදරෙන් ඔබට ළඟටම. ❤️🌏', ctaText: 'Shop Now', href: '/shop' },
    ];
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 5500);
        return () => clearInterval(id);
    }, []);

    const reviews = [
        { name: "Priya K.", location: "Toronto, Canada", rating: 5, comment: "The spices are incredibly fresh and authentic. Tastes just like my grandmother's cooking!", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
        { name: "Rajesh M.", location: "London, UK", rating: 5, comment: "Finally found a place that delivers genuine Sri Lankan products. The mango pickle is out of this world!", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
        { name: "Anjali P.", location: "Sydney, Australia", rating: 5, comment: "Excellent customer service and the products arrived perfectly packed. Will definitely order again!", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
        { name: "Kumar S.", location: "New York, USA", rating: 5, comment: "The tea leaves are exceptional quality. Reminds me of home. Will be a returning customer for sure!", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
        { name: "Meena R.", location: "Dubai, UAE", rating: 5, comment: "Authentic Sri Lankan flavors delivered right to my doorstep. The packaging was excellent!", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    ];
    const loopedReviews = [...reviews, ...reviews];

    const scrollReviews = (direction: 1 | -1) => {
        const container = reviewsContainerRef.current;
        if (!container) return;

        const step = 280;
        const resetPoint = container.scrollWidth / 2;
        if (direction === -1 && container.scrollLeft <= step) {
            container.scrollLeft += resetPoint;
        }
        if (direction === 1 && container.scrollLeft >= resetPoint - step) {
            container.scrollLeft -= resetPoint;
        }

        container.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    return (
        <div className={styles.culturalBg}>
            {/* Traditional top strip */}
            <div className={styles.traditionalStrip} />

            {/* Hero Section */}
            <section
                className={`relative w-full min-h-[24rem] md:min-h-[34rem] overflow-hidden ${styles.heroPattern}`}
                style={{
                    backgroundImage: 'url(/Background.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-amber-900/40 to-black/70 flex items-center justify-center px-4">
                    <div className="text-center text-white p-2 md:p-4 max-w-2xl mx-auto">
                        {/* Decorative top element */}
                        <div className="mb-6 flex justify-center">
                            <svg width="80" height="20" viewBox="0 0 80 20" className="opacity-60">
                                <path d="M0 10 Q20 0 40 10 Q60 20 80 10" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
                                <circle cx="40" cy="10" r="3" fill="#fbbf24" />
                            </svg>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tight">
                            <span key={slideIndex} className={styles.greetWord}>
                                {slides[slideIndex].title}
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mt-3 md:mt-4 text-amber-50/90 font-light px-2" key={`sub-${slideIndex}`}>
                            {slides[slideIndex].subtitle}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base text-amber-200/70 mt-1 md:mt-2">
                            Authentic Sri Lankan products delivered worldwide
                        </p>
                        <a href={slides[slideIndex].href} className={`${styles.ctaButton} mt-6 md:mt-8 text-sm md:text-base`}>
                            {slides[slideIndex].ctaText} →
                        </a>

                        {/* Slide indicators */}
                        <div className="flex justify-center gap-2 mt-5 md:mt-8">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlideIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slideIndex ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/60'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-amber-100 py-3 md:py-4">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
                        {[
                            { icon: '🎉', text: 'No Commission Over LKR 10K' },
                            { icon: '✅', text: '100% Authentic Products' },
                            { icon: '🔒', text: 'Secure Checkout' },
                            { icon: '💬', text: 'WhatsApp Support' },
                        ].map((item, i) => (
                            <div key={i} className={styles.trustItem}>
                                <span className={styles.trustIcon}>{item.icon}</span>
                                <span className="text-xs md:text-sm font-semibold text-amber-900 leading-tight text-center">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-10 md:py-20">
                {/* Our Heritage Section */}
                <AnimatedSection className="mb-12 md:mb-20">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6 ${styles.sectionHeading}`}>
                                Our Heritage
                            </h2>
                            <p className="text-base md:text-lg text-amber-900/80 mb-4 md:mb-6 leading-relaxed">
                                Lanka Drop is a celebration of Sri Lanka's rich Tamil culture. We are dedicated to preserving the legacy of our ancestors by bringing you the authentic flavours, crafts, and remedies from the heart of the Tamil homeland—from the vibrant markets of Yalpanam (Jaffna) to the serene villages of the North.
                            </p>
                            <p className="text-base md:text-lg text-amber-900/80 leading-relaxed hidden md:block">
                                Each product tells a story, a tradition passed down through generations. We partner with local artisans and family-run farms to ensure every item is not just a product, but a piece of our shared heritage.
                            </p>
                            <a href="/about" className="inline-flex items-center gap-2 mt-6 text-amber-800 font-semibold hover:text-amber-600 transition-colors group">
                                Learn our story
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                        <div className={styles.heritageImage}>
                            <img
                                src={heritageCooking}
                                alt="A family preparing a traditional Tamil meal"
                                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </AnimatedSection>

                <KolamDivider />

                {/* Categories Section */}
                <AnimatedSection>
                    <h2 className={`text-2xl sm:text-3xl font-serif font-bold text-center mb-8 md:mb-12 ${styles.sectionHeading}`}>
                        Explore Our Treasures
                    </h2>
                    {loading ? <Spinner /> : (
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                            {categories.map((category, i) => (
                                <AnimatedSection key={category.id} delay={i * 80} className="text-center">
                                    <a href={`/shop?category=${category.id}`} className="group block">
                                        <div className={`${styles.categoryCircle} mx-auto shadow-lg`}>
                                            <img
                                                src={categoryPlaceholders[category.name] || `https://picsum.photos/seed/${category.id}/300/300`}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="mt-2 md:mt-4 font-semibold text-amber-900 group-hover:text-amber-600 transition-colors text-xs md:text-sm leading-tight">
                                            {category.name}
                                        </p>
                                    </a>
                                </AnimatedSection>
                            ))}
                        </div>
                    )}
                </AnimatedSection>

                <KolamDivider />

                {/* Featured Products Section */}
                <AnimatedSection>
                    <h2 className={`text-2xl sm:text-3xl font-serif font-bold text-center mb-8 md:mb-12 ${styles.sectionHeading}`}>
                        Handpicked Favourites
                    </h2>
                    {loading ? <Spinner /> : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-6 md:mt-10">
                        <a href="/shop" className={styles.ctaButton}>
                            View All Products →
                        </a>
                    </div>
                </AnimatedSection>

                <KolamDivider />

                {/* The Yalpanam Pantry Section */}
                <AnimatedSection className="text-center">
                    <h2 className={`text-2xl sm:text-3xl font-serif font-bold mb-3 md:mb-4 ${styles.sectionHeading}`}>
                        The Yalpanam Pantry
                    </h2>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-amber-900/70 mb-8 md:mb-12 px-2">
                        The soul of our cuisine lies in its unique ingredients, cultivated under the northern sun.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                        {[
                            { img: pantryJaffnaSpices, title: "Fiery Jaffna Spices", desc: "A robust blend of sun-dried red chilies and roasted spices." },
                            { img: pantryPalmyra, title: "Sweet Palmyra Nectar", desc: "Pure, unrefined jaggery from the treasured Palmyra palm." },
                            { img: pantryPickles, title: "Authentic Pickles", desc: "Tangy, spicy preserves made from local fruits and vegetables." },
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={i * 120}>
                                <div className={styles.pantryCard}>
                                    <img src={item.img} alt={item.title} className="w-full h-48 sm:h-72 object-cover" />
                                    <div className={styles.pantryOverlay}>
                                        <h3 className="text-xl font-serif font-bold">{item.title}</h3>
                                        <p className="text-sm text-amber-100 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </AnimatedSection>

                <KolamDivider />

                {/* Customer Reviews Section */}
                <AnimatedSection>
                    <h2 className={`text-xl sm:text-2xl md:text-3xl font-serif font-bold text-center mb-6 md:mb-8 ${styles.sectionHeading}`}>
                        What Our Customers Say
                    </h2>

                    <div className="relative flex items-center">
                        {/* Left Arrow */}
                        <button
                            className={`${styles.reviewNavBtn} flex-shrink-0 bg-white p-2 md:p-2.5 rounded-full shadow-md hover:bg-amber-50 transition-all hover:shadow-lg border border-amber-100 active:scale-95 mr-2 md:mr-3 z-10`}
                            onClick={() => scrollReviews(-1)}
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Reviews */}
                        <div
                            ref={reviewsContainerRef}
                            className={`${styles.reviewsContainer} flex-1 flex overflow-x-auto pb-4 md:pb-6 space-x-3 md:space-x-6`}
                        >
                            {loopedReviews.map((review, index) => (
                                <div key={`${review.name}-${index}`} className={styles.reviewCard}>
                                    <div className="flex items-center mb-3 md:mb-4">
                                        <img src={review.avatar} alt={review.name} className="w-9 h-9 md:w-12 md:h-12 rounded-full mr-2.5 md:mr-4 border-2 border-amber-200" />
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-amber-900 text-sm md:text-base truncate">{review.name}</h4>
                                            <p className="text-xs text-amber-700/60 truncate">{review.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-2 md:mb-3 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-3.5 h-3.5 md:w-5 md:h-5 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-amber-900/70 italic leading-relaxed text-xs md:text-base line-clamp-4">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            className={`${styles.reviewNavBtn} flex-shrink-0 bg-white p-2 md:p-2.5 rounded-full shadow-md hover:bg-amber-50 transition-all hover:shadow-lg border border-amber-100 active:scale-95 ml-2 md:ml-3 z-10`}
                            onClick={() => scrollReviews(1)}
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </AnimatedSection>

                <KolamDivider />

                {/* Why Choose Lanka Drop */}
                <AnimatedSection>
                    <h2 className={`text-2xl sm:text-3xl font-serif font-bold text-center mb-8 md:mb-12 ${styles.sectionHeading}`}>
                        Why Choose Lanka Drop?
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { icon: '🌿', title: 'Direct Sourcing', desc: 'We source directly from local farmers and artisans in Sri Lanka, ensuring authenticity.' },
                            { icon: '👨‍🌾', title: 'Family Farms', desc: 'Supporting small family-run farms and traditional producers across the island.' },
                            { icon: '✈️', title: 'Fast Shipping', desc: 'Reliable worldwide delivery to bring Sri Lanka\'s finest to your doorstep.' },
                            { icon: '💯', title: 'Quality Guaranteed', desc: 'Every product is carefully selected and quality-checked before shipping.' },
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={i * 100}>
                                <div className={`${styles.whyCard} text-center`}>
                                    <span className={styles.whyIcon}>{item.icon}</span>
                                    <h3 className="font-semibold text-base md:text-lg text-amber-900 mb-1 md:mb-2">{item.title}</h3>
                                    <p className="text-amber-800/60 text-xs md:text-sm">{item.desc}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </AnimatedSection>
            </div>

            {/* Newsletter */}
            <NewsletterSignup />

            {/* Bottom traditional strip */}
            <div className={styles.traditionalStrip} />
        </div>
    );
};

export default HomePage;
