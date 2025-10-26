import React, { useState, useEffect, useRef } from 'react';

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

const faqData = [
    {
        question: "How does payment work?",
        answer: "After you place an order, we will contact you on WhatsApp with the total amount (including shipping) and provide you with payment options. We typically accept bank transfers or other common international payment methods."
    },
    {
        question: "How do you handle shipping?",
        answer: "We ship internationally using reliable courier services. Shipping costs vary based on your location and the weight of your order. We will provide you with a detailed shipping quote when we confirm your order on WhatsApp."
    },
    {
        question: "How long will my order take to arrive?",
        answer: "Delivery times depend on your location. Generally, it can take anywhere from 1 to 4 weeks after payment is confirmed. We will give you a more accurate estimate and a tracking number once your order is shipped."
    },
    {
        question: "Can I request a product that is not listed?",
        answer: "Absolutely! We specialize in sourcing authentic Sri Lankan products. If there's something specific you're looking for, please let us know through the contact form or WhatsApp, and we'll do our best to find it for you."
    }
];

const FaqItem: React.FC<{ item: typeof faqData[0]; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full flex justify-between items-center text-left py-4 px-2"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-lg text-gray-800">{item.question}</span>
                <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 text-gray-600 bg-gray-50">{item.answer}</p>
            </div>
        </div>
    );
};


const ContactPage: React.FC = () => {
    const whatsappLink = `https://wa.me/94000000000?text=${encodeURIComponent("Hi, I'd like to ask a question.")}`;
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({...formState, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission to a backend
        console.log("Form submitted:", formState);
        setIsSubmitted(true);
    };

    return (
        <div className="bg-white">
             {/* Hero Section */}
            <section className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/sri-lankan-coast/1600/600')" }}>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold animate-fade-in-up">Ayubowan!</h1>
                        <p className="text-lg md:text-xl mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>We'd love to hear from you.</p>
                    </div>
                </div>
            </section>
            
            <div className="container mx-auto px-6 py-20">
                <AnimatedSection>
                     <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Contact Form */}
                        <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                             <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Send Us a Message</h2>
                            {isSubmitted ? (
                                <div className="text-center p-8 bg-green-50 text-green-800 rounded-lg">
                                    <h3 className="text-xl font-semibold">Thank You!</h3>
                                    <p>Your message has been sent successfully. We will get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name</label>
                                        <input type="text" name="name" id="name" value={formState.name} onChange={handleFormChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                                    </div>
                                     <div>
                                        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
                                        <input type="email" name="email" id="email" value={formState.email} onChange={handleFormChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                                    </div>
                                     <div>
                                        <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
                                        <textarea name="message" id="message" value={formState.message} onChange={handleFormChange} rows={5} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-600 transition-colors">
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                        {/* Contact Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-orange-50 p-6 rounded-lg hover:shadow-lg transition-shadow border border-orange-100">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Direct Contact</h3>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors">
                                    <div className="bg-white p-3 rounded-full shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
                                    <div>
                                        <p className="font-semibold">WhatsApp</p>
                                        <p className="text-sm">Quickest way to get in touch</p>
                                    </div>
                                </a>
                                <a href="mailto:support@lankafresh.com" className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors mt-4">
                                     <div className="bg-white p-3 rounded-full shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                                     <div>
                                        <p className="font-semibold">Email Us</p>
                                        <p className="text-sm">support@lankafresh.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 text-gray-700 mt-4">
                                    <div className="bg-white p-3 rounded-full shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                                    <div>
                                        <p className="font-semibold">Based In</p>
                                        <p className="text-sm">Colombo, Sri Lanka</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </AnimatedSection>

                <CulturalAnimationDivider />
                
                <AnimatedSection className="max-w-4xl mx-auto">
                     <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
                     <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                         {faqData.map((item, index) => (
                            <FaqItem
                                key={index}
                                item={item}
                                isOpen={openFaqIndex === index}
                                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            />
                        ))}
                     </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default ContactPage;
