import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import { notifications } from '@mantine/notifications';
import type { CreateProductRequest, UpdateProductRequest } from '../types/product.types';


export const useAdminProducts = () => {
    const queryClient = useQueryClient();

     // Query para todos los productos incluyendo inactivos
    const adminProductsQuery = useQuery({
        queryKey: ["products", "admin"],
        queryFn: productsApi.getAllAdmin,
    });

    // Mutation para crear producto
    const createMutation = useMutation({
        mutationFn: (data: CreateProductRequest) => productsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notifications.show({
                title: 'Producto creado',
                message: 'El producto se creó exitosamente',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo crear el producto',
                color: 'red',
            });
        },
    });

    // Mutation para actualizar producto
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
            productsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notifications.show({
                title: 'Producto actualizado',
                message: 'El producto se actualizó exitosamente',
                color: 'blue',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el producto',
                color: 'red',
            });
        },
    });

    // Mutation para eliminar producto
    const deleteMutation = useMutation({
        mutationFn: (id: string) => productsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            notifications.show({
                title: 'Producto eliminado',
                message: 'El producto se eliminó exitosamente',
                color: 'blue',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo eliminar el producto',
                color: 'red',
            });
        },
    });

    // Mutation para subir imagen
    const uploadImageMutation = useMutation({
        mutationFn: (file: File) => productsApi.uploadImage(file),
        onSuccess: () => {
            notifications.show({
                title: 'Imagen subida',
                message: 'La imagen se subió exitosamente',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo subir la imagen',
                color: 'red',
            });
        },
    });

    // Mutation para activar/desactivar producto
    const toggleActiveMutation = useMutation({
        mutationFn: (id: string) => productsApi.toggleActive(id),
        onSuccess: (product) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            notifications.show({
                title: product.active ? "Producto activado" : "Producto desactivado",
                message: product.active ? "El producto está visible para los usuarios" : "El producto está oculto para los usuarios",
                color: product.active ? "green" : "orange",
            });
        },
        onError: () => {
            notifications.show({
                title: "Error",
                message: "No se pudo cambiar el estado del producto",
                color: "red",
            });
        },
    });

    return {
        adminProducts: adminProductsQuery.data,
        isLoadingAdmin: adminProductsQuery.isLoading, 
        createProduct: createMutation.mutate,
        updateProduct: updateMutation.mutate,
        deleteProduct: deleteMutation.mutate,
        uploadImage: uploadImageMutation.mutateAsync,
        toggleActive: toggleActiveMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadImageMutation.isPending,
        isTogglingActive: toggleActiveMutation.isPending,
    };
};