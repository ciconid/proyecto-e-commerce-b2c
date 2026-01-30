import { Button, Container, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Container style={{ textAlign: 'center', marginTop: '100px' }}>
            <Title order={1}>404</Title>
            <Text size="lg" mt="md">Página no encontrada</Text>
            <Button mt="xl" onClick={() => navigate('/products')}>
                Volver al inicio
            </Button>
        </Container>

    );
}

export default NotFoundPage;