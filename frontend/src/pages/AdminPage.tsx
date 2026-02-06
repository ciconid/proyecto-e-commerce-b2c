import { Container, Title, Tabs, Table, Group, Button, Loader, Modal, Stack, TextInput, NumberInput, Textarea } from '@mantine/core';
import { useProducts } from '../hooks/useProducts';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useState } from 'react';
import type z from 'zod';
import { createProductSchema } from '../utils/validations';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type CreateProductForm = z.infer<typeof createProductSchema>;

function AdminPage() {
    const { data: products, isLoading } = useProducts();
    const { deleteProduct, createProduct, isCreating } = useAdminProducts();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CreateProductForm>({
        resolver: zodResolver(createProductSchema),
    });

    const onCreateProduct = (data: CreateProductForm) => {
        createProduct(data, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
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
                        <Button onClick={() => setIsCreateModalOpen(true)}>
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
                                                <Button size="xs" variant="light">Editar</Button>
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
                    {/* Aquí va la tabla de órdenes */}
                </Tabs.Panel>
            </Tabs>

            <Modal
                opened={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Crear Nuevo Producto"
                size="lg"
                centered
                styles={{
                    inner: {
                        justifyContent: 'flex-start', 
                    },
                    content: {
                        margin: -300, // hardcodeado hasta encontrar solucion de posicion del Modal
                        width: '50vw',       
                        maxWidth: '50vw',
                        height: '100vh',
                        borderRadius: 0,
                    },
                }}


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

                        <TextInput
                            label="URL de Imagen"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            {...register('imageUrl')}
                            error={errors.imageUrl?.message}
                        />

                        <Button type="submit" fullWidth loading={isCreating}>
                            Crear Producto
                        </Button>
                    </Stack>
                </form>
            </Modal>

        </Container>
    );
}

export default AdminPage;