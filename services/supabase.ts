import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, Customer, Order, OrderStatus, CartItem } from '../types';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

let supabaseInstance: SupabaseClient;

export const getClient = (): SupabaseClient => {
    if (!supabaseInstance) {
        if (supabaseUrl && supabaseAnonKey) {
            supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        } else {
            throw new Error("Supabase credentials are not configured.");
        }
    }
    return supabaseInstance;
};

// Product Management
export const getProducts = async (filters: { category?: string, search?: string } = {}) => {
    const supabase = getClient();
    let query = supabase.from('products').select('*, categories(name)');
    if (filters.category) {
        query = query.eq('category_id', filters.category);
    }
    if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Product[];
};

export const getProductById = async (id: string) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('products').select('*, categories(name)').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data as Product;
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
};

export const deleteProduct = async (id: string) => {
    const supabase = getClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

export const uploadProductImage = async (file: File) => {
    const supabase = getClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) throw new Error(error.message);
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
    return publicUrl;
};

// Category Management
export const getCategories = async () => {
    const supabase = getClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw new Error(error.message);
    return data as Category[];
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
};

export const deleteCategory = async (id: string) => {
    const supabase = getClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
};

// Order Management (Public)
export const createOrder = async (customerDetails: Omit<Customer, 'id' | 'created_at'>, cartItems: CartItem[]) => {
    const supabase = getClient();
    const { data: customerData, error: customerError } = await supabase.from('customers').insert(customerDetails).select().single();
    if (customerError || !customerData) throw new Error(customerError?.message || 'Failed to create customer.');

    const total_amount = cartItems.reduce((sum, item) => sum + item.product.price_lkr * item.quantity, 0);
    const orderPayload = {
        customer_id: customerData.id,
        total_amount,
        status: OrderStatus.Pending,
    };
    const { data: orderData, error: orderError } = await supabase.from('orders').insert(orderPayload).select().single();
    if (orderError || !orderData) throw new Error(orderError?.message || 'Failed to create order.');

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
        .select('*, customers(*)')
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Order[];
};

export const getOrderById = async (orderId: string) => {
    const supabase = getClient();
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, customers(*)')
        .eq('id', orderId)
        .single();
    if (orderError) throw new Error(orderError.message);

    const { data: orderItemsData, error: orderItemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
    if (orderItemsError) throw new Error(`Failed to load order items: ${orderItemsError.message}`);

    const productIds = Array.from(
        new Set((orderItemsData || []).map(item => item.product_id).filter(Boolean))
    ) as string[];

    let productsById: Record<string, Product> = {};
    if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);
        if (productsError) throw new Error(`Failed to load products: ${productsError.message}`);

        productsById = (productsData || []).reduce((acc, product) => {
            acc[product.id] = product as Product;
            return acc;
        }, {} as Record<string, Product>);
    }

    const hydratedItems = (orderItemsData || []).map(item => ({
        ...item,
        products: item.product_id ? productsById[item.product_id] : undefined
    }));

    return {
        ...(orderData as any),
        order_items: hydratedItems
    } as Order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = getClient();
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
    if (error) throw new Error(error.message);
    return data;
};

// Customer Management (Admin)
export const getCustomers = async () => {
    const supabase = getClient();
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Customer[];
};

export const getCustomerOrders = async (customerId: string) => {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Order[];
};

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

export const getAuthDebug = async () => {
    const supabase = getClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData.user?.id || null;

    let isAdmin = false;
    if (userId) {
        const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
        if (error) throw error;
        isAdmin = !!data;
    }

    return {
        userId,
        isAdmin,
        projectUrl: supabaseUrl
    };
};

export const isCurrentUserAdmin = async () => {
    const { isAdmin } = await getAuthDebug();
    return isAdmin;
};

export const onAuthStateChange = (callback: (session: Session | null) => void) => {
    const supabase = getClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
    return subscription;
};
