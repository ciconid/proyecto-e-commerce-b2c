import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../api/orders.api";
import { notifications } from "@mantine/notifications";

export const useOrders = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: ordersApi.getUserOrders,
    });

    const createOrderMutation = useMutation({
        mutationFn: ordersApi.createOrder,
        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });

            notifications.show({
                title: 'Orden creada',
                message: `Orden #${order.id} creada exitosamente`,
                color: 'green',
            });

            navigate('/orders');
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo crear la orden',
                color: 'red',
            });
        },
    });

    return {
        orders: ordersQuery.data,
        isLoading: ordersQuery.isLoading,
        error: ordersQuery.error,
        createOrder: createOrderMutation.mutate,
        isCreatingOrder: createOrderMutation.isPending,
    };

};