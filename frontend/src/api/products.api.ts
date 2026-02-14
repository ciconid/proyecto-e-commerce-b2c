import type { CreateProductRequest, Product, UpdateProductRequest } from "../types/product.types";
import axiosInstance from "./axios";


export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const response = await axiosInstance.get<Product[]>("/products");
        return response.data;
    },

    getAllAdmin: async (): Promise<Product[]> => {
        const response = await axiosInstance.get<Product[]>("/products/all");
        return response.data;
    },

    create: async (data: CreateProductRequest): Promise<Product> => {
        const response = await axiosInstance.post<Product>("/products", data);
        return response.data;
    },

    update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
        const response = await axiosInstance.patch<Product>(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/products/${id}`);
    },

    uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<{ imageUrl: string }>(
            "/products/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    toggleActive: async (id: string): Promise<Product> => {
        const response = await axiosInstance.patch<Product>(`/products/${id}/toggle-active`);
        return response.data;
    },
};