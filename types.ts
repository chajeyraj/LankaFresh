
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_lkr: number;
  price_usd?: number;
  image_url: string;
  origin?: string;
  weight_grams?: number;
  cultural_significance?: string;
  created_at: string;
  categories: { name: string };
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