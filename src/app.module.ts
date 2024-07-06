import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    ProductsModule,
    AuthModule,
    CommonModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
