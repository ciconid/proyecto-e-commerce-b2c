import type z from "zod";
import { loginSchema } from "../utils/validations";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth.api";
import { notifications } from "@mantine/notifications";
import { Container, Title, Text, Paper, Stack, TextInput, PasswordInput, Button } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

function LoginPage() {
    type LoginFormData = z.infer<typeof loginSchema>;


    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await authApi.login(data);
            setAuth(response.user, response.access_token, response.refresh_token);

            notifications.show({
                title: 'Login exitoso',
                message: `Bienvenido ${response.user.name}`,
                color: 'green'
            });

            navigate('/products');
        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Error al iniciar sesión',
                color: 'red',
            });
        }


    };


    return (
        <Container size={420} my={40}>
            <Title ta="center">Bienvenido</Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                ¿No tenés cuenta?{' '}
                <Text component="a" href="/register" c="blue" style={{ cursor: 'pointer' }}>
                Registrate
                </Text>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                    label="Email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                    />
                    
                    <PasswordInput
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    {...register('password')}
                    error={errors.password?.message}
                    />
                    
                    <Button type="submit" fullWidth loading={isSubmitting}>
                    Iniciar sesión
                    </Button>
                </Stack>
                </form>
            </Paper>
            </Container>
    );
}

export default LoginPage;