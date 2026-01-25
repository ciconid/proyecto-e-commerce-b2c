import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get current user cart' })
    @ApiResponse({ status: 200, description: 'User cart' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getCart(@CurrentUser() user: { id: string }) {
        return this.cartService.getOrCreateCart(user.id);
    }


    @Post('items')
    @ApiOperation({ summary: 'Add product to cart' })
    @ApiResponse({ status: 201, description: 'Product added to cart' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    addItem(@CurrentUser() user: { id: string }, @Body() addToCartDto: AddToCartDto ) {
        return this.cartService.addItem(user.id, addToCartDto);
    }


    @Patch('items/:productId')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiParam({ name: 'productId', description: 'Product UUID' })
    @ApiResponse({ status: 200, description: 'Cart item updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Item not found in cart' })
    updateItem(
        @CurrentUser() user: { id: string },
        @Param('productId') productId: string,
        @Body() updateCartItemDto: UpdateCartItemDto
    ) {
        return this.cartService.updateItem(user.id, productId, updateCartItemDto);
    }


    @Delete('items/:productId')
    @ApiOperation({ summary: 'Remove product from cart' })
    @ApiParam({ name: 'productId', description: 'Product UUID' })
    @ApiResponse({ status: 200, description: 'Product removed from cart' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Item not found in cart' })
    removeItem(
        @CurrentUser() user: { id: string }, 
        @Param('productId') productId: string
    ) {
        return this.cartService.removeItem(user.id, productId);
    }


    @Delete()
    @ApiOperation({ summary: 'Clear cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    clearCart(@CurrentUser() user: { id: string }) {
        return this.cartService.clearCart(user.id);
    }
}
