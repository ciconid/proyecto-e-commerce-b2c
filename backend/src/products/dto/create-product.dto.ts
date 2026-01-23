import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({description: 'Nombre del producto', example: 'Notebook Ultrabook'})
    name: string;

    @ApiProperty({
        description: 'Descripcion del producto',
        example: 'Notebook liviana ideal para trabajo y estudio',
        required: false
    })
    description?: string;

    @ApiProperty({description: 'Precio del producto', example: 1199.00})
    price: number; 
    
    @ApiProperty({description: 'Stock del producto', example: 150})
    stock: number; 
    
    @ApiProperty({
        description: 'URL de la imagen del producto', 
        example: 'Notebook Ultrabook',
        required: false
    })
    imageUrl?: string;    
}
