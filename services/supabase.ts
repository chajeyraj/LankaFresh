import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, Customer, Order, OrderStatus, CartItem } from '../types';

// Export the credentials so the App can check if they exist.
export const supabaseUrl = 'https://utgklacoftkomoysoewu.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0Z2tsYWNvZnRrb21veXNvZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDQ1NDcsImV4cCI6MjA3Njk4MDU0N30.F1_UBmrPTtFwJO32nC1oiQHR9O1MZ8xnlEtLcmCzXjE';

let supabaseInstance: SupabaseClient;

// --- START MOCK DATA ---

const mockCategories: Category[] = [
    { id: '1', name: 'Spices & Herbs', description: 'Authentic spice blends and aromatic herbs from the heart of Sri Lanka.', created_at: new Date().toISOString() },
    { id: '2', name: 'Sweets & Snacks', description: 'Traditional sweets and savoury snacks, made with time-honoured recipes.', created_at: new Date().toISOString() },
    { id: '3', name: 'Handicrafts', description: 'Exquisite, handcrafted items showcasing the skill of local artisans.', created_at: new Date().toISOString() },
    { id: '4', name: 'Tea & Coffee', description: 'World-renowned Ceylon tea and rich, locally grown coffee.', created_at: new Date().toISOString() },
    { id: '5', name: 'Health & Wellness', description: 'Natural remedies and wellness products based on ancient Ayurvedic wisdom.', created_at: new Date().toISOString() },
    { id: '6', name: 'Apparel & Textiles', description: 'Beautiful handloom sarees and traditional garments.', created_at: new Date().toISOString() },
];

const mockProducts: Product[] = [
    {
        id: 'p1', category_id: '1', name: 'Authentic Jaffna Curry Powder',
        description: 'A fiery and aromatic blend of hand-roasted spices, following a traditional family recipe from the Jaffna peninsula. Perfect for authentic Northern Sri Lankan curries.',
        price_lkr: 1200.00, image_url: 'https://picsum.photos/seed/jaffna-curry-powder/400/300',
        origin: 'Jaffna', weight_grams: 250,
        cultural_significance: "The unique roasting process gives Jaffna curry its distinctive dark color and deep flavour, a hallmark of the region's cuisine.",
        created_at: new Date().toISOString(), categories: { name: 'Spices & Herbs' }
    },
    {
        id: 'p2', category_id: '2', name: 'Palmyra Jaggery (Panam Katti Karupatti)',
        description: 'Pure, unrefined jaggery made from the sap of the Palmyra palm tree. A healthy and delicious natural sweetener with a rich, smoky flavour.',
        price_lkr: 950.00, image_url: 'https://picsum.photos/seed/palmyra-jaggery/400/300',
        origin: 'Northern Province', weight_grams: 500,
        cultural_significance: 'The Palmyra palm is considered the "celestial tree" in Tamil culture and its products are central to the region\'s diet and economy.',
        created_at: new Date().toISOString(), categories: { name: 'Sweets & Snacks' }
    },
    {
        id: 'p3', category_id: '3', name: 'Hand-Woven Palmyra Leaf Basket',
        description: 'A beautiful and durable basket, intricately woven by skilled female artisans. Ideal for storage or as a unique decorative piece.',
        price_lkr: 2500.00, image_url: 'https://picsum.photos/seed/palmyra-leaf-crafts/400/300',
        origin: 'Mannar', weight_grams: 400,
        cultural_significance: 'Weaving with Palmyra leaves is a traditional craft passed down through generations, showcasing intricate patterns and sustainable practices.',
        created_at: new Date().toISOString(), categories: { name: 'Handicrafts' }
    },
    {
        id: 'p4', category_id: '4', name: 'Ceylon Silver Tips White Tea',
        description: 'A rare and prized tea made from only the unopened buds of the tea plant. Delivers a delicate, subtle flavour with notes of honey and fruit.',
        price_lkr: 3500.00, image_url: 'https://picsum.photos/seed/ceylon-silver-tips/400/300',
        origin: 'Nuwara Eliya', weight_grams: 100,
        cultural_significance: 'Considered the champagne of teas, Silver Tips are hand-plucked at dawn and sun-dried, following an ancient Chinese method perfected in Sri Lanka.',
        created_at: new Date().toISOString(), categories: { name: 'Tea & Coffee' }
    },
    {
        id: 'p5', category_id: '1', name: 'Cinnamon Verum Sticks (True Cinnamon)',
        description: 'Premium quality Ceylon cinnamon sticks, known for their delicate fragrance and sweet, warm flavour. Far superior to common Cassia varieties.',
        price_lkr: 800.00, image_url: 'https://picsum.photos/seed/ceylon-cinnamon/400/300',
        origin: 'Matale', weight_grams: 150,
        cultural_significance: 'Ceylon cinnamon has been a prized spice for centuries and is a key export of Sri Lanka. It\'s used in both sweet and savoury dishes worldwide.',
        created_at: new Date().toISOString(), categories: { name: 'Spices & Herbs' }
    },
    {
        id: 'p6', category_id: '2', name: 'Kalu Dodol',
        description: 'A rich, dark, and sticky sweet delicacy made from coconut milk, jaggery, and rice flour, slow-cooked for hours to achieve its unique texture.',
        price_lkr: 1500.00, image_url: 'https://picsum.photos/seed/kalu-dodol/400/300',
        origin: 'Hambantota', weight_grams: 500,
        cultural_significance: 'A festive favourite, Kalu Dodol is often prepared for special occasions and cultural celebrations like the Sinhala and Tamil New Year.',
        created_at: new Date().toISOString(), categories: { name: 'Sweets & Snacks' }
    },
    {
        id: 'p7', category_id: '5', name: 'Siddhalepa Ayurvedic Balm',
        description: 'A world-famous herbal balm based on Ayurvedic traditions. Provides relief from aches, pains, colds, and flu symptoms.',
        price_lkr: 600.00, image_url: 'https://picsum.photos/seed/siddhalepa-balm/400/300',
        origin: 'Colombo', weight_grams: 50,
        cultural_significance: 'Siddhalepa is a household name in Sri Lanka, representing the island\'s rich heritage of indigenous medicine and natural healing.',
        created_at: new Date().toISOString(), categories: { name: 'Health & Wellness' }
    },
    {
        id: 'p8', category_id: '3', name: 'Traditional Kandyan Mask',
        description: 'A vibrant, hand-carved wooden mask representing a character from ancient Sri Lankan folklore. Used in traditional dances and rituals.',
        price_lkr: 4500.00, image_url: 'https://picsum.photos/seed/kandyan-mask/400/300',
        origin: 'Ambalangoda', weight_grams: 700,
        cultural_significance: 'These masks, known as "ves muhunu," are an integral part of Sri Lankan cultural performances and are believed to have healing and protective powers.',
        created_at: new Date().toISOString(), categories: { name: 'Handicrafts' }
    },
    {
        id: 'p9', category_id: '6', name: 'Handloom Cotton Saree',
        description: 'A soft, breathable cotton saree woven on a traditional handloom. Features elegant, minimalist patterns perfect for everyday wear.',
        price_lkr: 6800.00, image_url: 'https://picsum.photos/seed/handloom-saree/400/300',
        origin: 'Jaffna',
        cultural_significance: 'The handloom industry in Jaffna is a significant part of the local economy, known for producing high-quality textiles with unique designs.',
        created_at: new Date().toISOString(), categories: { name: 'Apparel & Textiles' }
    },
    {
        id: 'p10', category_id: '2', name: 'Kithul Treacle',
        description: 'A dark, sweet syrup extracted from the flower of the Kithul palm. A delicious and natural topping for desserts, yogurt, and pancakes.',
        price_lkr: 1100.00, image_url: 'https://picsum.photos/seed/kithul-treacle/400/300',
        origin: 'Ratnapura', weight_grams: 350,
        cultural_significance: 'Kithul tapping is a traditional art, and the resulting treacle and jaggery are cherished components of Sri Lankan cuisine.',
        created_at: new Date().toISOString(), categories: { name: 'Sweets & Snacks' }
    },
    {
        id: 'p11', category_id: '1', name: 'Sun-Dried Red Chilies',
        description: 'Whole dried red chilies from the Northern Province, known for their vibrant color and intense heat. A staple in any Sri Lankan kitchen.',
        price_lkr: 750.00, image_url: 'https://picsum.photos/seed/dried-chilies/400/300',
        origin: 'Vavuniya', weight_grams: 200,
        cultural_significance: 'Chilies are fundamental to Sri Lankan cooking, providing the characteristic spiciness that defines many of the island\'s most famous dishes.',
        created_at: new Date().toISOString(), categories: { name: 'Spices & Herbs' }
    },
    {
        id: 'p12', category_id: '5', name: 'Herbal Porridge Mix (Kola Kanda)',
        description: 'A nutritious instant mix of rice and several medicinal herbs. Just add coconut milk and water for a healthy, traditional breakfast.',
        price_lkr: 850.00, image_url: 'https://picsum.photos/seed/kola-kanda/400/300',
        origin: 'Rural Villages', weight_grams: 300,
        cultural_significance: 'Kola Kanda is a traditional herbal gruel consumed for its immense health benefits, embodying the principle of "food as medicine" in Sri Lankan culture.',
        created_at: new Date().toISOString(), categories: { name: 'Health & Wellness' }
    }
];

// --- END MOCK DATA ---


// This client accessor ensures Supabase is initialized only once.
// The App component will check for credentials before any of these functions are called.
// FIX: Export the getClient function so it can be used directly by components.
export const getClient = (): SupabaseClient => {
    if (!supabaseInstance) {
        if (supabaseUrl && supabaseAnonKey) {
            supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        } else {
            // This should not be reached if the App component's check is in place.
            throw new Error("Supabase credentials are not configured. The application cannot start.");
        }
    }
    return supabaseInstance;
};


// Product Management
export const getProducts = async (filters: { category?: string, search?: string } = {}) => {
    // MOCK IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    let products = mockProducts;
    if (filters.category) {
        products = products.filter(p => p.category_id === filters.category);
    }
    if (filters.search) {
        products = products.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    }
    return products as Product[];
};

export const getProductById = async (id: string) => {
    // MOCK IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
        throw new Error(`Mock product with id ${id} not found`);
    }
    return product as Product;
};

export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'categories'>) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('products').insert(productData).select().single();
    if (error) throw new Error(error.message);
    return data;
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'categories'>>) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export const deleteProduct = async (id: string) => {
    const supabase = getClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

export const uploadProductImage = async (file: File) => {
    const supabase = getClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('products').upload(fileName, file);
    if (error) throw new Error(error.message);
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path);
    return publicUrl;
};


// Category Management
export const getCategories = async () => {
    // MOCK IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    return mockCategories as Category[];
};

export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
    if (error) throw new Error(error.message);
    return data;
};

export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export const deleteCategory = async (id: string) => {
    const supabase = getClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Order Management (Public)
export const createOrder = async (customerDetails: Omit<Customer, 'id'|'created_at'>, cartItems: CartItem[]) => {
    const supabase = getClient();
    // 1. Create Customer
    const { data: customerData, error: customerError } = await supabase.from('customers').insert(customerDetails).select().single();
    if (customerError || !customerData) throw new Error(customerError?.message || 'Failed to create customer.');

    // 2. Calculate Total and Create Order
    const total_amount = cartItems.reduce((sum, item) => sum + item.product.price_lkr * item.quantity, 0);
    const orderPayload = {
        customer_id: customerData.id,
        total_amount,
        status: OrderStatus.Pending,
    };
    const { data: orderData, error: orderError } = await supabase.from('orders').insert(orderPayload).select().single();
    if (orderError || !orderData) throw new Error(orderError?.message || 'Failed to create order.');

    // 3. Create Order Items
    const orderItemsPayload = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price_lkr,
    }));
    const { error: orderItemsError } = await supabase.from('order_items').insert(orderItemsPayload);
    if (orderItemsError) throw new Error(orderItemsError.message);

    return orderData as Order;
};

// Order Management (Admin)
export const getOrders = async () => {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*, customers(*), order_items(*, products(*))')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Order[];
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
    if (error) throw new Error(error.message);
    return data;
}

// Customer Management (Admin)
export const getCustomers = async () => {
    const supabase = getClient();
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Customer[];
}

export const getCustomerOrders = async (customerId: string) => {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Order[];
}


// Auth
export const signIn = async (email: string, password: string) => {
    const supabase = getClient();
    return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
    const supabase = getClient();
    return supabase.auth.signOut();
};

export const getSession = async () => {
    const supabase = getClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};

export const onAuthStateChange = (callback: (session: Session | null) => void) => {
    const supabase = getClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
    return subscription;
};