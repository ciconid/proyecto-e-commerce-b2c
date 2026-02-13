import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        PrismaModule,
        ProductsModule,
        AuthModule,
        UsersModule,
        CartModule,
        OrdersModule,
        CloudinaryModule,
        ConfigModule.forRoot({ isGlobal: true })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
