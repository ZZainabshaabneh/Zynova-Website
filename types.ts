// types.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePrompt: string;
  stock: number;
  category: string;
  vendorId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  isVendor: boolean;
  subscriptionActive: boolean;
}

export interface Order {
    id: string;
    vendorId: string;
    items: CartItem[];
    total: number;
    createdAt: Date;
}

export interface Notification {
    id: string;
    message: string;
    vendorId: string;
    type: 'cart' | 'order';
}