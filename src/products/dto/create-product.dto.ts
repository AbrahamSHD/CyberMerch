import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Runner Max Shoes',
    nullable: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'General information about the product',
    example:
      'Ergonomic Design: These shoes are designed to adapt to the natural shape of the foot, offering a comfortable and secure fit.',
    nullable: true,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Product cost',
    example: '89.90',
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'ID of the user who created the product',
    example: '87151d0b-0624-44c4-bf68-0ce921fc8ff0',
    nullable: false,
    minLength: 1,
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
