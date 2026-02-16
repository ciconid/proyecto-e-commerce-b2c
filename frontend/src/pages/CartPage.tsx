import { Box, Button, Card, Center, Container, Group, Image, Loader, Text, Title } from "@mantine/core";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";

function CartPage() {
    const { cart, isLoading, error, updateItem, removeItem } = useCart();
    const { createOrder, isCreatingOrder } = useOrders();

    if (isLoading) {
        return (
            <Center style={{ minHeight: "100vh" }}>
                <Loader size={"xl"}></Loader>
            </Center>
        );
    }

    if (error) {
        return (
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Container>
                    <Text c={"red"}>Error al cargar productos</Text>
                </Container>
            </Box>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Container>
                    <Title>Mi Carrito</Title>
                    <Text mt="md">Tu carrito está vacío</Text>
                    <Button component={Link} to="/products" mt="md">
                        Ver productos
                    </Button>
                </Container>
            </Box>
        );
    }

    const total = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const sortedItems = [...(cart.items ?? [])].sort((a, b) => 
        new Date(a.product.createdAt).getTime() - new Date(b.product.createdAt).getTime()
    );


    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <Container px={"xl"} size={"md"}>
                <Title>Mi carrito</Title>

                {sortedItems.map((item) => (
                    <Card withBorder padding="lg" key={item.id}>
                        <Group justify="space-between" mb="md">
                            <Image src={item.product.imageUrl} width={80} height={200} />

                            <div>
                                <Text fw={500}>{item.product.name}</Text>
                                <Text size="sm" c="dimmed">${item.product.price}</Text>
                            </div>

                            <Group>
                                <Button
                                    size="xs"
                                    onClick={() => updateItem({
                                        itemId: item.product.id,
                                        quantity: item.quantity - 1
                                    })}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </Button>
                                <Text>{item.quantity}</Text>
                                <Button
                                    size="xs"
                                    onClick={() => updateItem({
                                        itemId: item.product.id,
                                        quantity: item.quantity + 1
                                    })}
                                >
                                    +
                                </Button>
                            </Group>

                            <Text fw={700}>${item.product.price * item.quantity}</Text>

                            <Button
                                color="red"
                                size="sm"
                                onClick={() => removeItem(item.product.id)}
                            >
                                Eliminar
                            </Button>

                        </Group>
                    </Card>
                ))}


                <Card withBorder padding="lg" mt="md">
                    <Group justify="space-between">
                        <Text size="xl" fw={700}>Total:</Text>
                        <Text size="xl" fw={700}>${total}</Text>
                    </Group>

                    <Button
                        fullWidth
                        mt="md"
                        size="lg"
                        loading={isCreatingOrder}
                        onClick={() => createOrder()}
                    >
                        Finalizar compra
                    </Button>
                </Card>





            </Container>

        </Box>

    );
}

export default CartPage;