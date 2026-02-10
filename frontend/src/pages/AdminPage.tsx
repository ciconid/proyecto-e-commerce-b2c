import { Container, Title, Tabs, Table, Group, Button, Loader, Modal, Stack, TextInput, NumberInput, Textarea, Select } from '@mantine/core';
import { useProducts } from '../hooks/useProducts';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useState } from 'react';
import type z from 'zod';
import { createProductSchema } from '../utils/validations';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product } from '../types/product.types';
import { useOrders } from '../hooks/useOrders';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { ImageUpload } from '../components/ImageUpload';

type CreateProductForm = z.infer<typeof createProductSchema>;

function AdminPage() {
    const { data: products, isLoading } = useProducts();
    const { deleteProduct, createProduct, isCreating, updateProduct, isUpdating, uploadImage, isUploading } = useAdminProducts();

    const { orders: allOrders, isLoading: ordersLoading } = useOrders();
    const { updateOrderStatus } = useAdminOrders();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CreateProductForm>({
        resolver: zodResolver(createProductSchema),
    });

    const onCreateProduct = (data: CreateProductForm) => {
        console.log('📤 Datos a enviar:', data);
        createProduct(data, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const onEditProduct = (data: CreateProductForm) => {
        if (!selectedProduct) return;

        updateProduct(
            { id: selectedProduct.id, data },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                    reset();
                },
            }
        );
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        reset({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl || '',
        });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        reset();
    };

    const modalStyles = {
        inner: {
            justifyContent: 'flex-start',
        },
        content: {
            margin: -300,
            width: '50vw',
            maxWidth: '50vw',
            height: '100vh',
            borderRadius: 0,
        },
    };

    const resetModal = () => {
        reset({
            name: "",
            description: "",
            //price: 0,
            //stock: 0,
            imageUrl: "",
        });
    };

    return (
        <Container fluid px="xl" py="xl">
            <Title mb="xl">Panel de Administración</Title>

            <Tabs defaultValue="products">
                <Tabs.List>
                    <Tabs.Tab value="products">Productos</Tabs.Tab>
                    <Tabs.Tab value="orders">Órdenes</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="products" pt="xl">
                    <Group justify="space-between" mb="md">
                        <Title order={2}>Gestión de Productos</Title>
                        <Button onClick={() => {
                            resetModal();
                            setIsCreateModalOpen(true)
                        }}>
                            Crear Producto
                        </Button>
                    </Group>

                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Nombre</Table.Th>
                                    <Table.Th>Precio</Table.Th>
                                    <Table.Th>Stock</Table.Th>
                                    <Table.Th>Acciones</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {products?.map((product) => (
                                    <Table.Tr key={product.id}>
                                        <Table.Td>{product.name}</Table.Td>
                                        <Table.Td>${product.price}</Table.Td>
                                        <Table.Td>{product.stock}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    onClick={() => handleEditClick(product)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    color="red"
                                                    variant="light"
                                                    onClick={() => deleteProduct(product.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="orders" pt="xl">
                    <Title order={2} mb="md">Todas las Órdenes</Title>
                    {ordersLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>Usuario</Table.Th>
                                    <Table.Th>Total</Table.Th>
                                    <Table.Th>Estado</Table.Th>
                                    <Table.Th>Fecha</Table.Th>
                                    <Table.Th>Acciones</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {allOrders?.map((order) => (
                                    <Table.Tr key={order.id}>
                                        <Table.Td>{order.id.substring(0, 8)}...</Table.Td>
                                        <Table.Td>{order.userId.substring(0, 8)}...</Table.Td>
                                        <Table.Td>${order.total}</Table.Td>
                                        <Table.Td>
                                            <Select
                                                value={order.status}
                                                onChange={(value) => value && updateOrderStatus({ id: order.id, status: value })}
                                                data={[
                                                    { value: 'pendiente', label: 'Pendiente' },
                                                    { value: 'completada', label: 'Completada' },
                                                    { value: 'cancelada', label: 'Cancelada' },
                                                ]}
                                                size="xs"
                                            />
                                        </Table.Td>
                                        <Table.Td>{new Date(order.createdAt).toLocaleDateString()}</Table.Td>
                                        <Table.Td>
                                            <Button size="xs" variant="light">Ver Detalle</Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}


                </Tabs.Panel>
            </Tabs>

            {/* Modal Crear Producto */}
            <Modal
                opened={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Crear Nuevo Producto"
                size="lg"
                centered
                styles={modalStyles}
            >
                <form onSubmit={handleSubmit(onCreateProduct)}>
                    <Stack>
                        <TextInput
                            label="Nombre"
                            placeholder="Nombre del producto"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <Textarea
                            label="Descripción"
                            placeholder="Descripción del producto"
                            {...register('description')}
                            error={errors.description?.message}
                        />

                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    label="Precio"
                                    placeholder="0.00"
                                    min={0}
                                    decimalScale={2}
                                    error={errors.price?.message}
                                />
                            )}
                        />

                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    label="Stock"
                                    placeholder="0"
                                    min={0}
                                    error={errors.stock?.message}
                                />
                            )}
                        />

                        <Controller
                            name="imageUrl"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <ImageUpload
                                    value={field.value || ''}
                                    onChange={(url) => {
                                        console.log('🖼️ ImageURL recibida:', url);
                                        field.onChange(url);
                                    }}
                                    onUpload={uploadImage}
                                    isUploading={isUploading}
                                />
                            )}
                        />

                        <Button type="submit" fullWidth loading={isCreating}>
                            Crear Producto
                        </Button>
                    </Stack>
                </form>
            </Modal>

            {/* Modal Editar Producto */}
            <Modal
                opened={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Editar Producto"
                size="lg"
                centered
                styles={modalStyles}
            >
                <form onSubmit={handleSubmit(onEditProduct)}>
                    <Stack>
                        <TextInput
                            label="Nombre"
                            placeholder="Nombre del producto"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <Textarea
                            label="Descripción"
                            placeholder="Descripción del producto"
                            {...register('description')}
                            error={errors.description?.message}
                        />

                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    label="Precio"
                                    placeholder="0.00"
                                    min={0}
                                    decimalScale={2}
                                    error={errors.price?.message}
                                />
                            )}
                        />

                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    label="Stock"
                                    placeholder="0"
                                    min={0}
                                    error={errors.stock?.message}
                                />
                            )}
                        />

                        <Controller
                            name="imageUrl"
                            control={control}
                            render={({ field }) => (
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    onUpload={uploadImage}
                                    isUploading={isUploading}
                                />
                            )}
                        />

                        <Button type="submit" fullWidth loading={isUpdating}>
                            Actualizar Producto
                        </Button>
                    </Stack>
                </form>
            </Modal>

        </Container>
    );
}

export default AdminPage;