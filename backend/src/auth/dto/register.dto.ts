import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({example: 'Juan Perez'})
    name: string;
    
    @ApiProperty({example: 'usuario@ejemplo.com'})
    email: string;
    
    @ApiProperty({example: 'password123'})
    password: string;
}