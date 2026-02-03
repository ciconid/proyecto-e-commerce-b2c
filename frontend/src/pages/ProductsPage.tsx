import { Card, Container, Grid, Title, Image, Button, Text, SimpleGrid, Center, Loader } from "@mantine/core";
import { useProducts } from "../hooks/useProducts";


function ProductsPage() {
    const { data: products, error, isLoading } = useProducts();

    if (isLoading){
        return(
            <Center style={{ minHeight: "100vh" }}>
                <Loader size={"xl"}></Loader>
            </Center>
        );
    }

    if (error) {
        return(
            <Container>
                <Text c={"red"}>Error al cargar productos</Text>
            </Container>
        );
    }

    return (
        <Container size={"xl"}>
            <Title mb={"xl"}>Productos</Title>

            <Grid>
                <SimpleGrid cols={{base: 1, sm: 2, md: 3, lg: 4}} spacing={"md"}>
                    {
                        products?.map((product) => (
                            <Card 
                                withBorder
                                key={product.id} 
                                h="100%"
                                style={{ display: "flex", flexDirection: "column" }}
                            >

                                <Image 
                                    src={product.imageUrl || "https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png"}
                                    height={200}    
                                />

                                <Title order={3} mt={"md"}>{product.name}</Title>
                                <Text size="sm" c={"dimmed"}>{product.description}</Text>
                                <Text size="xl" fw={700} mt={"md"}>${product.price}</Text>
                                <Text size="sm">Stock: {product.stock}</Text>

                                <Button fullWidth mt="auto">Agregar al carrito</Button>
                            </Card>        
                        ))
                    } 
                </SimpleGrid>
            </Grid>
        </Container>
    );
}

export default ProductsPage;