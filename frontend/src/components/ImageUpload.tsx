import { useState } from 'react';
import { Button, Group, Image, Text, Box, Stack } from '@mantine/core';
import { IconUpload, IconX } from '@tabler/icons-react';

interface ImageUploadProps {
    value?: string;
    onChange: (imageUrl: string) => void;
    onUpload: (file: File) => Promise<{ imageUrl: string }>;
    isUploading?: boolean;
}

export const ImageUpload = ({ value, onChange, onUpload, isUploading }: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(value || null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor seleccioná una imagen válida');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar los 5MB');
            return;
        }

        try {
            // Mostrar preview local
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Subir a Cloudinary
            const result = await onUpload(file);

            // El resultado puede ser string directo o { imageUrl: string }
            const imageUrl = typeof result === 'string' ? result : result.imageUrl;

            onChange(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            setPreview(null);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
    };

    return (
        <Stack gap="sm">
            <Text size="sm" fw={500}>
                Imagen del producto
            </Text>

            {preview ? (
                <Box>
                    <Image
                        src={preview}
                        alt="Preview"
                        height={200}
                        fit="contain"
                        style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}
                    />
                    <Group mt="sm">
                        <Button
                            variant="light"
                            color="red"
                            leftSection={<IconX size={16} />}
                            onClick={handleRemove}
                            disabled={isUploading}
                        >
                            Quitar imagen
                        </Button>
                    </Group>
                </Box>
            ) : (
                <Box>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="image-upload"
                        disabled={isUploading}
                    />
                    <label htmlFor="image-upload">
                        <Button
                            component="span"
                            leftSection={<IconUpload size={16} />}
                            loading={isUploading}
                            variant="light"
                        >
                            Seleccionar imagen
                        </Button>
                    </label>
                    <Text size="xs" c="dimmed" mt="xs">
                        Formatos: JPG, PNG, WEBP. Máximo 5MB
                    </Text>
                </Box>
            )}
        </Stack>
    );
};