
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string | null;
  parent_id?: string | null;
  parent?: Pick<Category, 'id' | 'name'> | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price_lkr: number;
  price_usd?: number;
  image_url: string | null;
  origin?: string;
  weight_grams?: number;
  cultural_significance?: string;
  created_at: string;
  categories: { id?: string; name: string; parent_id?: string | null } | null;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp_number: string;
  country: string;
  delivery_address?: string;
  notes?: string;
  created_at: string;
}

export enum OrderStatus {
  Pending = 'Pending Review',
  Processing = 'Processing',
  Delivered = 'Delivered'
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  customers: Customer;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string | null;
  rating: number;
  comment: string;
  avatar_url?: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}
