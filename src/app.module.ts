import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductsModule, AuthModule, CommonModule],
})
export class AppModule {}
