import type { Order } from "../types/order.types";
import axiosInstance from "./axios";

export const ordersApi = {
    createOrder: async (): Promise<Order> => {
        const response = await axiosInstance.post<Order>("/orders");
        return response.data;
    },

    getUserOrders: async (): Promise<Order[]> => {
        const response = await axiosInstance.get<Order[]>("/orders");
        return response.data;
    },

    getOrderById: async (id: string): Promise<Order> => {
        const response = await axiosInstance.get<Order>(`/orders/${id}`);
        return response.data;
    }
    

};