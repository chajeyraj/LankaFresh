import React, { useState, useEffect, useRef } from 'react';

// Custom hook for scroll animations, adapted for this page
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

// Culturally inspired animated divider
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

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-96 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://picsum.photos/seed/sri-lankan-tea-estate/1600/800')" }}>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold animate-fade-in-up">From Our Island, To Your Home</h1>
                        <p className="text-lg md:text-xl mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Bringing Sri Lanka Closer to You <span className="text-2xl">🇱🇰</span></p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-20">
                {/* Our Story Section */}
                <AnimatedSection>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Welcome to Lanka Drop Services</h2>
                            <p className="text-base text-gray-600 mb-6 leading-relaxed text-justify">
                                Your trusted partner for fast and reliable deliveries across Sri Lanka and beyond. At Lanka Drop, we bring the warmth of Sri Lankan home-made products and the true essence of our island directly to your doorstep — wherever you are in the world.
                            </p>
                            <p className="text-base text-gray-600 leading-relaxed mb-6 text-justify">
                                Our service is specially designed for Sri Lankans living abroad who miss the authentic taste and touch of home. From traditional food items to hand-crafted goods, we ensure that every order is handled with care, packed safely, and delivered quickly.
                            </p>
                            <p className="text-base text-gray-600 leading-relaxed text-justify">
                                We operate under two main delivery types — <strong>Direct Delivery from Sri Lanka</strong>, where we purchase and ship items on your behalf, and two flexible delivery options by Lanka Drop: <strong>Fast Delivery</strong> for urgent and time-sensitive packages, and <strong>Normal Delivery</strong> for cost-friendly shipping.
                            </p>
                        </div>
                <div className="order-1 md:order-2">
                    <div className="bg-orange-50 p-6 rounded-lg shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Payment Policy</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-orange-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">Order Value (USD)</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">Advance Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-orange-200">
                                    <tr className="hover:bg-orange-50">
                                        <td className="px-4 py-3 text-gray-700">Up to $65</td>
                                        <td className="px-4 py-3 text-gray-600">No advance required</td>
                                    </tr>
                                    <tr className="hover:bg-orange-50">
                                        <td className="px-4 py-3 text-gray-700">$65 - $165</td>
                                        <td className="px-4 py-3 text-gray-600">50% in advance</td>
                                    </tr>
                                    <tr className="hover:bg-orange-50">
                                        <td className="px-4 py-3 text-gray-700">$165 - $500</td>
                                        <td className="px-4 py-3 text-gray-600">75% in advance</td>
                                    </tr>
                                    <tr className="hover:bg-orange-50">
                                        <td className="px-4 py-3 text-gray-700">$500 - $1,650</td>
                                        <td className="px-4 py-3 text-gray-600">85% in advance</td>
                                    </tr>
                                    <tr className="hover:bg-orange-50">
                                        <td className="px-4 py-3 text-gray-700">Above $1,650</td>
                                        <td className="px-4 py-3 text-gray-600">100% in advance</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-gray-600">
                            This tiered system helps us ensure fairness, security, and smooth processing for every valued customer.
                        </p>
                    </div>
                    </div>
                </div>
                </AnimatedSection>
                
                <CulturalAnimationDivider />

                {/* Our Mission Section */}
                <AnimatedSection>
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            To connect Sri Lankans everywhere with the heart of home through a trusted, efficient, and affordable delivery experience.
                        </p>
                    </div>
                </AnimatedSection>

                <CulturalAnimationDivider />

                {/* Our Promise Section */}
                <AnimatedSection>
                    <div className="text-center mb-12">
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            At Lanka Drop, we believe every parcel carries memories, love, and the soul of Sri Lanka — that's why we take pride in every delivery, ensuring quality, reliability, and care from our island to your hands.
                        </p>
                        <div className="mt-8 text-4xl">Lanka Drop Services — Bringing Sri Lanka Closer to You. <span className="text-3xl">🇱🇰</span></div>
                    </div>
                </AnimatedSection>

                <CulturalAnimationDivider />

                {/* Our Promise Section */}
                <AnimatedSection className="text-center">
                    <h2 className="text-4xl font-serif font-bold text-gray-800 mb-12">Our Promise to You</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="p-6">
                             <div className="flex justify-center items-center h-20 w-20 mx-auto bg-orange-100 rounded-full text-primary mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Authenticity Guaranteed</h3>
                            <p className="text-gray-600">We carefully select genuine, high-quality products directly from local producers, ensuring you get the true taste and craftsmanship of Sri Lanka.</p>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-center items-center h-20 w-20 mx-auto bg-orange-100 rounded-full text-primary mb-4">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Community Focused</h3>
                            <p className="text-gray-600">Your purchases support local economies and small-scale producers across the island, helping preserve traditional industries and empower communities.</p>
                        </div>
                         <div className="p-6">
                            <div className="flex justify-center items-center h-20 w-20 mx-auto bg-orange-100 rounded-full text-primary mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Personalized Service</h3>
                            <p className="text-gray-600">We communicate directly via WhatsApp to ensure your order is perfect. We're here to answer questions and provide a seamless, transparent experience.</p>
                        </div>
                    </div>
                </AnimatedSection>
                
                <CulturalAnimationDivider />
                
                {/* Journey Section */}
                <AnimatedSection className="text-center">
                    <h2 className="text-4xl font-serif font-bold text-gray-800 mb-12">The Journey of Our Products</h2>
                    <div className="relative flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-orange-200 hidden md:block" />
                        <div className="flex flex-col items-center z-10 p-4">
                            <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl mb-2">1</div>
                            <h4 className="font-semibold">Sourced Locally</h4>
                            <p className="text-sm text-gray-600">From island farms & artisans</p>
                        </div>
                         <div className="flex flex-col items-center z-10 p-4">
                            <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl mb-2">2</div>
                            <h4 className="font-semibold">Packed with Care</h4>
                            <p className="text-sm text-gray-600">Handled & prepared for travel</p>
                        </div>
                         <div className="flex flex-col items-center z-10 p-4">
                            <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl mb-2">3</div>
                            <h4 className="font-semibold">Shipped Globally</h4>
                             <p className="text-sm text-gray-600">Reliably delivered to you</p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Call to Action */}
                <AnimatedSection className="mt-20 text-center bg-orange-50 p-12 rounded-lg">
                    <h2 className="text-3xl font-serif font-bold text-gray-800">Ready to Experience a Taste of Home?</h2>
                    <p className="text-gray-600 mt-2 mb-6 max-w-2xl mx-auto">Browse our curated selection of authentic Sri Lankan goods and let us bring a piece of the island to your doorstep.</p>
                    <a href="#/shop" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors text-lg">
                        Explore Our Collection
                    </a>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default AboutPage;
