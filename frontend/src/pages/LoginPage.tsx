import { Button, Center, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validations";
import { authApi } from "../api/auth.api";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const queryClient = useQueryClient();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await authApi.login(data);
            setAuth(response.user, response.access_token, response.refresh_token);
            queryClient.clear();

            notifications.show({
                message: `Bienvenido ${response.user.name}`,
                title: "Login exitoso",
                color: "green",
            });

            navigate("/products");

        } catch (error: any) {
            notifications.show({
                message: error.response?.data?.message || "Error al iniciar sesión",
                title: "Error",
                color: "red",
            });   
        }
    };



    return(
        <Center style={{ minHeight: "100vh", width: "100vw"}}>
            <Container size={420} my={40}>
                <Title ta="center">Bienvenido</Title>
                <Text c="dimmed" size="sm" ta="center">
                    No tienes cuenta?{' '}
                    <Text component="a" href="/register" c="blue" style={{cursor: "pointer"}}>
                        Registrate    
                    </Text>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <TextInput 
                                label="Email"
                                placeholder="tu@email.com"
                                {...register("email")}
                                error={errors.email?.message}
                             />

                            <PasswordInput 
                                label="Contraseña"
                                placeholder="Tu contraseña"
                                {...register("password")}
                                error={errors.password?.message}
                            />

                            <Button type="submit" fullWidth loading={isSubmitting}>
                                Iniciar sesión
                            </Button>
                        </Stack>
                    </form>
                </Paper>

            </Container>
                    
        </Center>

    );
}

export default LoginPage;