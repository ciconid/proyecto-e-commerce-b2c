import { ActionIcon, Anchor, Badge, Box, Group, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconLogout } from "@tabler/icons-react"
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";


function Navbar() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const user = useAuthStore((state) => state.user);

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };


    return (
        <Box
            p={"md"}
            style={{
                borderBottom: "1px solid #dee2e6",
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 100
            }}
        >
            <Group justify="space-between">
                <Text size="xl" fw={700} c={"blue"}>Mi tienda</Text>

                <Group>
                    <Anchor component={Link} to={"/products"}>
                        Productos
                    </Anchor>

                    <Anchor component={Link} to={"/cart"} style={{ position: "relative" }}>
                        Carrito
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

                    <Anchor component={Link} to={"/orders"}>
                        Mis Órdenes
                    </Anchor>

                    {user?.role === "admin" &&
                        <Anchor component={Link} to={"/admin"}>
                            Admin Panel
                        </Anchor>
                    }


                    <ActionIcon onClick={handleLogout}>
                        <IconLogout />
                    </ActionIcon>
                </Group>

            </Group>
        </Box>
    );
}

export default Navbar;