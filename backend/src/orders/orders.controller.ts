import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }


    @Post()
    @ApiOperation({ summary: 'Create order from cart' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Cart is empty' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@CurrentUser() user: { id: string }) {
        return this.ordersService.create(user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get orders (own orders or all if admin)' })
    @ApiResponse({ status: 200, description: 'List of orders' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@CurrentUser() user: { id: string; role: string }) {
        const isAdmin = user.role === 'admin';
        return this.ordersService.findAll(user.id, isAdmin);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiParam({ name: 'id', description: 'Order UUID' })
    @ApiResponse({ status: 200, description: 'Order found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
        const isAdmin = user.role === 'admin';
        return this.ordersService.findOne(id, user.id, isAdmin);
    }    

    @Patch(':id/status')
    @Roles('admin')
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Update order status (Admin only)' })
    @ApiParam({ name: 'id', description: 'Order UUID' })
    @ApiResponse({ status: 200, description: 'Order status updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, updateOrderStatusDto);
    }




}
