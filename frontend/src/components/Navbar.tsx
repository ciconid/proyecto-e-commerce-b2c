import { Anchor, Badge, Box, Container, Group, Menu, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronDown, IconLogout, IconUser, IconShoppingCart } from "@tabler/icons-react"
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useQueryClient } from "@tanstack/react-query";


function Navbar() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const user = useAuthStore((state) => state.user);

    const queryClient = useQueryClient();

    const handleLogout = () => {
        clearAuth();
        queryClient.clear();
        navigate("/products");
    };


    return (
        <Box
            px={"md"}
            style={{
                borderBottom: "1px solid #dee2e6",
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 100,
                height: "12vh"
            }}
        >
            <Container size={"xl"} h={"100%"}>
                <Group justify="space-between" align="flex-end" h={"100%"} pb={"xs"}>
                    <Text size="xl" fw={700} c={"blue"}>Mi tienda</Text>

                    <Group>
                        <Anchor component={Link} to={"/products"}>
                            Productos
                        </Anchor>

                        {user && (
                            <Anchor component={Link} to={"/orders"}>
                                Mis Órdenes
                            </Anchor>
                        )}

                        {user && user.role === "admin" &&
                            <Anchor component={Link} to={"/admin"}>
                                Admin Panel
                            </Anchor>
                        }

                        {user && (
                            <Anchor component={Link} to={"/cart"} style={{ position: "relative" }}>
                                    <IconShoppingCart size={22}/>
                                    {totalItems > 0 &&
                                        <Badge
                                            size="md"
                                            circle
                                            color="red"
                                            style={{
                                                position: "absolute",
                                                top: -8,
                                                right: -12
                                            }}
                                        >
                                            {totalItems}
                                        </Badge>
                                    }
                                </Anchor>
                        )}

                        {user ? (
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Group gap={4} style={{ cursor: "pointer" }}>
                                        <IconUser size={18} />
                                        <Text size="sm" fw={500}>
                                            {user?.name}
                                        </Text>
                                        <IconChevronDown size={14} />
                                    </Group>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>{user?.email}</Menu.Label>
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconLogout size={16} />}
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Anchor component={Link} to={"/login"}>
                                <Group gap={4}>
                                    <IconUser size={18} />
                                    <Text size="sm" fw={500}>Iniciar sesión</Text>
                                </Group>
                            </Anchor>
                        )}


                    </Group>

                </Group>
            </Container>

        </Box>
    );
}

export default Navbar;