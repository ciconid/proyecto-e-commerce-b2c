import type { Product } from "../types/product.types";
import axiosInstance from "./axios";


export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const response = await axiosInstance.get<Product[]>('/products');

        return response.data;
    }
};