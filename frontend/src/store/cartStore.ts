import { create } from "zustand";
import type { CartItemWithProduct } from "../types/order.types";

interface CartStore {
    items: CartItemWithProduct[];

    setCart(items: CartItemWithProduct[]): void;
    addItem(item: CartItemWithProduct): void;
    removeItem(itemId: string): void;
    updateQuantity(itemId: string, quantity: number): void;
    clearCart(): void;
    getTotalItems(): number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    setCart(items: CartItemWithProduct[]) {
        set({items});
    },

    addItem(item: CartItemWithProduct) {
        set((state) => ({
            items: [...state.items, item]
        }));
    },

    removeItem(itemId: string) {
        set((state) => ({
            items: state.items.filter((item) => itemId !== item.id)
        }));
    },
    
    updateQuantity(itemId: string, quantity: number) {  
        set((state) => ({
            items: state.items.map((item) => 
                itemId === item.id ? {...item, quantity} : item)
        }));

    },
    
    clearCart() {
        set({items: []});
    },
    
    getTotalItems() {
        const items = get().items;
        
        if (!items || items.length === 0) return 0;

        return get().items.reduce((total, item) => total + item.quantity, 0);
    }

}));