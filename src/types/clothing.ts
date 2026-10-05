export type ProductCategory =
  | 'all'
  | 'outerwear'
  | 'tailoring'
  | 'knitwear'
  | 'dresses'
  | 'trousers'
  | 'tops';

export interface ProductColor {
  name: string;
  hex: string;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'outerwear' | 'tailoring' | 'knitwear' | 'dresses' | 'trousers' | 'tops';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  detailImages?: string[];
  colors: ProductColor[];
  sizes: string[];
  material: string;
  fit: string;
  care: string;
  details: string[];
  tag?: string;
  isNew?: boolean;
  inventory: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
  shippingDetails: ShippingDetails;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'credit_card' | 'apple_pay' | 'cash_on_delivery';
  status: 'confirmed' | 'tailoring_inspection' | 'dispatched' | 'out_for_delivery';
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface FilterOptions {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  size: string | null;
  color: string | null;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}
