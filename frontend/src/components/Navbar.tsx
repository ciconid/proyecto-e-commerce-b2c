import { ActionIcon, Anchor, Box, Group, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconLogout } from "@tabler/icons-react"
import { useAuthStore } from "../store/authStore";


function Navbar() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };


    return(
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

                    <ActionIcon onClick={handleLogout}>
                        <IconLogout />
                    </ActionIcon>
                </Group>
                
            </Group>
        </Box>
    );
}

export default Navbar;