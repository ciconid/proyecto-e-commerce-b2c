import { Box, Button, Card, Center, Collapse, Container, Group, Loader, Text, Title } from "@mantine/core";
import { useOrders } from "../hooks/useOrders";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

function OrdersPage() {
    const { orders, isLoading, error } = useOrders();
    const [openedOrders, setOpenedOrders] = useState<Record<string, boolean>>({});

    const toggleOrder = (orderId: string) => {
        setOpenedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    if (isLoading) {
        return (
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Center style={{ minHeight: '100vh' }}>
                    <Loader size="xl" />
                </Center>
            </Box>
        );
    }

    if (error) {
        return (
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Container fluid px="xl">
                    <Text c="red">Error al cargar las órdenes</Text>
                </Container>
            </Box>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Container fluid px="xl">
                    <Title mb="md">Mis Órdenes</Title>
                    <Text>No tenés órdenes todavía</Text>
                    <Button component={Link} to="/products" mt="md">
                        Ver productos
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <Container>
                <Title>Mis Órdenes</Title>

                {orders.map((order) => (
                    <Card key={order.id} withBorder padding="lg" mb="md">
                        <div onClick={() => toggleOrder(order.id)} style={{ cursor: 'pointer' }}>
                            <Group justify="space-between" mb="sm">
                                <div>
                                    <Text fw={700}>Orden #{order.id}</Text>
                                    <Text size="sm" c="dimmed">
                                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </div>
                                <Group gap="md">
                                    <div style={{ textAlign: 'right' }}>
                                        <Text fw={700} size="lg">${order.total}</Text>
                                        <Text size="sm" c="dimmed">{order.status}</Text>
                                    </div>
                                    <IconChevronDown
                                        size={20}
                                        style={{
                                            transform: openedOrders[order.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 200ms ease'
                                        }}
                                    />
                                </Group>
                            </Group>

                            <Text size="sm" c="dimmed">
                                {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                            </Text>
                        </div>

                        <Collapse in={openedOrders[order.id]}>
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
                                {order.items.map((item) => (
                                    <Group key={item.id} justify="space-between" mb="xs">
                                        <Text size="sm">{item.product.name} x{item.quantity}</Text>
                                        <Text size="sm" fw={500}>${item.price * item.quantity}</Text>
                                    </Group>
                                ))}
                            </div>
                        </Collapse>
                    </Card>
                ))}

            </Container>
        </Box>
    );
}

export default OrdersPage;