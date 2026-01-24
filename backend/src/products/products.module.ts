import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [AuthModule]
})
export class ProductsModule {}
