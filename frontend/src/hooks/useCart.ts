import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useCartStore } from "../store/cartStore";
import { cartApi } from "../api/cart.api";
import { notifications } from "@mantine/notifications";

export const useCart = () => {
    const queryClient = useQueryClient();
    const { setCart } = useCartStore();

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const cart = await cartApi.getCart();
            setCart(cart.items);

            return cart;
        }
    });

    // Mutation para agregar item
    const addItemMutation = useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
            cartApi.addItem(productId, quantity),
        onSuccess: (cart) => {
            setCart(cart.items);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            notifications.show({
                title: 'Producto agregado',
                message: 'El producto se agregó al carrito',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo agregar el producto',
                color: 'red',
            });
        },
    });

    // Mutation para actualizar cantidad
    const updateItemMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            cartApi.updateItem(itemId, quantity),
        onSuccess: (cart) => {
            setCart(cart.items);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    // Mutation para eliminar item
    const removeItemMutation = useMutation({
        mutationFn: (itemId: string) => cartApi.removeItem(itemId),
        onSuccess: (cart) => {
            setCart(cart.items);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            notifications.show({
                title: 'Producto eliminado',
                message: 'El producto se eliminó del carrito',
                color: 'blue',
            });
        },
    });

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        error: cartQuery.error,
        addItem: addItemMutation.mutate,
        updateItem: updateItemMutation.mutate,
        removeItem: removeItemMutation.mutate,
    };

};