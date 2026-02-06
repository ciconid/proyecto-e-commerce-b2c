import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { notifications } from '@mantine/notifications';

export const useAdminOrders = () => {
    const queryClient = useQueryClient();

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            ordersApi.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            notifications.show({
                title: 'Estado actualizado',
                message: 'El estado de la orden se actualizó correctamente',
                color: 'blue',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'No se pudo actualizar el estado',
                color: 'red',
            });
        },
    });

    return {
        updateOrderStatus: updateStatusMutation.mutate,
        isUpdating: updateStatusMutation.isPending,
    };
};