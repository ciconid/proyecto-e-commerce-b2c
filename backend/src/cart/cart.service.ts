import { Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { use } from 'passport';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }


    // Obtener o crear carrito del usuario
    async getOrCreateCart(userId: string) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Si no existe, crear el carrito vacio
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }


        return cart;
    }


    // Agregar producto al carrito
    async addItem(userId: string, addToCartDto: AddToCartDto) {
        const cart = await this.getOrCreateCart(userId);

        // Verificar si el producto existe
        const product = await this.prisma.product.findUnique({
            where: { id: addToCartDto.productId }
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        // Verificar si ya esta en el carrito
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: addToCartDto.productId
                }
            }
        });

        if (existingItem) {
            // Actualizar cantidad
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + addToCartDto.quantity},
                include: { product: true }
            });
        }

        // Crear nuevo item
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: addToCartDto.productId,
                quantity: addToCartDto.quantity
            },
            include: { product: true }
        });
    }


    // Actualizar cantidad de un item
    async updateItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto) {
        const cart = await this.getOrCreateCart(userId);

        const item = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        });

        if (!item) {
            throw new NotFoundException('Producto no encontrado en el carrito');
        }

        
        return this.prisma.cartItem.update({
            where: { id: item.id},
            data: { quantity: updateCartItemDto.quantity},
            include: { product: true }
        });
    }


    // Quitar producto del carrito
    async removeItem(userId: string, productId: string) {
        const cart = await this.getOrCreateCart(userId);

        const item = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        });

        if (!item) {
            throw new NotFoundException('Producto no encontrado en el carrito');
        }


        return this.prisma.cartItem.delete({
            where: {id: item.id}
        });
    }


    // Vaciar carrito
    async clearCart(userId: string) {
        const cart = await this.getOrCreateCart(userId);

        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });


        return { message: 'Carrito vaciado '};
    }

    
}
