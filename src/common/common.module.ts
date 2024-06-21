import { Module } from '@nestjs/common';
import { BcryptAdapter } from './config/bcrypt.adapter';

@Module({
  imports: [],
  providers: [BcryptAdapter],
  exports: [BcryptAdapter],
})
export class CommonModule {}
