import type { Cart } from "../types/order.types";
import axiosInstance from "./axios";

export const cartApi = {
    getCart: async (): Promise<Cart> => {
        const response = await axiosInstance.get<Cart>("/cart");

        return response.data;
    },

    addItem: async (productId: string, quantity: number): Promise<Cart> => {
        const response = await axiosInstance.post<Cart>("/cart/items", {
            productId,
            quantity
        });

        return response.data;
    },

    updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
        const response = await axiosInstance.patch<Cart>(`/cart/items/${itemId}`, {
            quantity
        });

        return response.data;
    },

    removeItem: async (itemId: string): Promise<Cart> => {
        const response = await axiosInstance.delete<Cart>(`/cart/items/${itemId}`);

        return response.data;
    },

    clearCart: async (): Promise<void> => {
        await axiosInstance.delete("/cart");
    }




};