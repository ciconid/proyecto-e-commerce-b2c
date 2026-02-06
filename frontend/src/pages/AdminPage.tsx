import { Container, Title, Tabs } from '@mantine/core';

function AdminPage() {
    return (
        <Container fluid px="xl" py="xl">
            <Title mb="xl">Panel de Administración</Title>

            <Tabs defaultValue="products">
                <Tabs.List>
                    <Tabs.Tab value="products">Productos</Tabs.Tab>
                    <Tabs.Tab value="orders">Órdenes</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="products" pt="xl">
                    <Title order={2} mb="md">Gestión de Productos</Title>
                    {/* Aquí va la tabla de productos */}
                </Tabs.Panel>

                <Tabs.Panel value="orders" pt="xl">
                    <Title order={2} mb="md">Todas las Órdenes</Title>
                    {/* Aquí va la tabla de órdenes */}
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}

export default AdminPage;