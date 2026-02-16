import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService
    ) { }


    // Crear orden desde el carrito
    async create(userId: string) {
        // Obtener un carrito con items
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('El carrito esta vacio');
        }

        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new BadRequestException(
                    `Stock insuficiente para "${item.product.name}". ` +
                    `Disponible: ${item.product.stock}, solicitado: ${item.quantity}.`
                );
            }
        }

        // Calcular total
        const total = cart.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        // Crear orden con items, descontar stock y vaciar carrito (transacción atómica)
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total,
                    status: 'pendiente',
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            // Descontar stock de cada producto
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });
            }

            // Vaciar carrito 
            await this.cartService.clearCart(userId);  // ⚠️ ver nota abajo

            return newOrder;
        });

        return order;
    }


    // Ver órdenes (filtradas por usuario o todas si es admin)
    async findAll(userId: string, isAdmin: boolean) {
        const where = isAdmin ? {} : { userId };

        return this.prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }


    // Ver detalle de una orden
    async findOne(id: string, userId: string, isAdmin: boolean) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                },
            }
        });

        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }

        if (!isAdmin && order.userId !== userId) {
            throw new NotFoundException('Orden no encontrada');
        }


        return order;
    }


    // Actualizar estado de orden (solo admin)
    async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id }
        });

        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }

        return this.prisma.order.update({
            where: { id },
            data: { status: updateOrderStatusDto.status },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }



}
