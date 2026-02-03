import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products.api";


export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getAll
    });
};