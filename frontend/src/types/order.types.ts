import type { Product } from './product.types';

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItemWithProduct[];
    createdAt: string;
    updatedAt: string;
}

export interface CartItemWithProduct {
    id: string;
    quantity: number;
    product: Product;
}

export interface Order {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}