import { Button, Center, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { registerSchema } from "../utils/validations";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await authApi.register(data);
            setAuth(response.user, response.access_token, response.refresh_token);

            notifications.show({
                message: `Bienvenido ${response.user.name}`,
                title: "Registro exitoso",
                color: "green",
            });

            navigate("/products");

        } catch (error: any) {
            notifications.show({
                message: error.response?.data?.message || "Error al registrarse",
                title: "Error",
                color: "red",
            });
        }
    };

    return(
        <Center style={{ minHeight: "100vh", width: "100vw"}}>
            <Container size={420} my={40}>
                <Title ta="center">Crear cuenta</Title>
                <Text c="dimmed" size="sm" ta="center">
                    Ya tienes cuenta?{' '}
                    <Text component="a" href="/login" c="blue" style={{cursor: "pointer"}}>
                        Iniciar sesión
                    </Text>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <TextInput
                                label="Nombre"
                                placeholder="Tu nombre"
                                {...register("name")}
                                error={errors.name?.message}
                            />

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
                                Registrarse
                            </Button>
                        </Stack>
                    </form>
                </Paper>

            </Container>
        
        </Center>
    );
}

export default RegisterPage;