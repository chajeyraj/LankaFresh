import React, { useState, useEffect, useRef } from 'react';
import { getClient } from '../../services/supabase';
import heroContact from '../../src/assets/hero-contact.jpg';

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

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const [ref, isVisible] = useScrollAnimation<HTMLElement>();
    return (
        <section ref={ref} className={`transition-opacity duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
            {children}
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
                <span className="font-semibold text-base sm:text-lg text-gray-800">{item.question}</span>
                <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 text-gray-600 bg-gray-50 text-sm sm:text-base">{item.answer}</p>
            </div>
        </div>
    );
};


const ContactPage: React.FC = () => {
    const whatsappLink = `https://wa.me/94000000000?text=${encodeURIComponent("Hi, I'd like to ask a question.")}`;
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({...formState, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const { error } = await getClient().from('contact_messages').insert({
                name: formState.name.trim(),
                email: formState.email.trim(),
                message: formState.message.trim(),
            });
            if (error) throw error;
            setIsSubmitted(true);
            setFormState({ name: '', email: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 4000);
        } catch (err: any) {
            setSubmitError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-orange-50/30">
             {/* Hero Section */}
            <section className="relative h-56 sm:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${heroContact}')` }}>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold animate-fade-in-up">Ayubowan!</h1>
                        <p className="text-sm sm:text-lg md:text-xl mt-3 sm:mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>We'd love to hear from you.</p>
                    </div>
                </div>
            </section>

            {/* Quick Contact Buttons */}
            <div className="container mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span className="text-sm sm:text-base">WhatsApp</span>
                    </a>
                    <a
                        href="mailto:support@lankadrop.com"
                        className="flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span className="text-sm sm:text-base">Email Us</span>
                    </a>
                    <a
                        href="tel:+94000000000"
                        className="flex items-center justify-center gap-2 col-span-2 sm:col-span-1 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: '#f97316' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span className="text-sm sm:text-base">Call Us</span>
                    </a>
                </div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <AnimatedSection>
                     <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 items-start">
                        {/* Contact Form */}
                        <div className="lg:col-span-3 bg-white p-5 sm:p-8 rounded-xl shadow-lg border border-gray-100">
                             <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-4 sm:mb-6">Send Us a Message</h2>
                            {isSubmitted && (
                                <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <p className="font-medium">Thank you! Your message has been sent successfully.</p>
                                </div>
                            )}
                            {submitError && (
                                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                                    <p>{submitError}</p>
                                </div>
                            )}
                                <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block mb-1.5 sm:mb-2 font-medium text-gray-700 text-sm sm:text-base">Full Name</label>
                                        <input type="text" name="name" id="name" value={formState.name} onChange={handleFormChange} required className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"/>
                                    </div>
                                     <div>
                                        <label htmlFor="email" className="block mb-1.5 sm:mb-2 font-medium text-gray-700 text-sm sm:text-base">Email Address</label>
                                        <input type="email" name="email" id="email" value={formState.email} onChange={handleFormChange} required className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"/>
                                    </div>
                                     <div>
                                        <label htmlFor="message" className="block mb-1.5 sm:mb-2 font-medium text-gray-700 text-sm sm:text-base">Message</label>
                                        <textarea name="message" id="message" value={formState.message} onChange={handleFormChange} rows={5} required className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm sm:text-base"></textarea>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#f97316', color: '#ffffff' }} className="w-full font-semibold py-3 rounded-lg hover:opacity-90 transition-colors text-sm sm:text-base shadow-md disabled:opacity-50">
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                        </div>
                        {/* Contact Details */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group mb-3">
                                    <div className="bg-green-500 p-2.5 rounded-full shadow-sm text-white group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base">WhatsApp</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Quickest way to reach us</p>
                                    </div>
                                </a>
                                <a href="mailto:support@lankadrop.com" className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group mb-3">
                                     <div className="bg-gray-800 p-2.5 rounded-full shadow-sm text-white group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                     <div>
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Email Us</p>
                                        <p className="text-xs sm:text-sm text-gray-500">support@lankadrop.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-orange-50">
                                    <div className="bg-primary p-2.5 rounded-full shadow-sm text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Based In</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Colombo, Sri Lanka</p>
                                    </div>
                                </div>
                            </div>

                            {/* Our Branches */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Our Branches</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Jaffna', 'Batticaloa', 'Trincomalee', 'Colombo', 'Nuwara Eliya'].map(branch => (
                                        <div key={branch} className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <span className="text-primary">📍</span>
                                            <span>{branch}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Business Hours</h3>
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Mon – Fri</span><span className="font-medium text-gray-800">9:00 AM – 6:00 PM</span></div>
                                    <div className="flex justify-between"><span>Saturday</span><span className="font-medium text-gray-800">9:00 AM – 2:00 PM</span></div>
                                    <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-red-500">Closed</span></div>
                                </div>
                            </div>
                        </div>
                     </div>
                </AnimatedSection>

                <CulturalAnimationDivider />
                
                <AnimatedSection className="max-w-4xl mx-auto">
                     <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
                     <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100">
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
