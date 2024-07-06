import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ClothingGender,
  ClothingSize,
  ProductTag,
} from '../../common/interfaces';

export class CreateProductDto {
  @ApiProperty({
    example: '1e10e09d-eb51-409b-9770-21f6a8a84799',
    description: 'Product ID (UUID)',
    uniqueItems: true,
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Runner Max Shoes',
    nullable: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

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
  @IsNotEmpty()
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
    description: 'runner_max shoes',
    example: '89.90',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Number of products in stock',
    example: 10,
    nullable: false,
    default: 0,
  })
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  stock: number;

  @ApiProperty({
    description:
      'If the product is clothing, its measurements can be given according to the "ClothingSize"',
    examples: ['M', 'L', 'XL'],
    default: [],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(ClothingSize, { each: true })
  @IsOptional()
  size: ClothingSize[];

  @ApiProperty({
    description:
      'If the product is clothing, the gender to whom it is directed can be determined according to the "ClothingGender"',
    examples: ['MALE', 'FEMALE', 'UNISEX'],
    default: [],
  })
  @IsArray()
  @IsEnum(ClothingGender, { each: true })
  @IsNotEmpty()
  @IsOptional()
  gender: ClothingGender;

  @ApiProperty({
    description:
      'Tags allow products to be classified into specific categories or relevant topics',
    example: ['Juegos', 'Música'],
    default: [],
  })
  @IsArray()
  @IsEnum(ProductTag, { each: true })
  @IsNotEmpty()
  @IsOptional()
  tags: ProductTag[];

  @ApiProperty({
    description: 'Product creation date',
    example: 10,
    default: 0,
  })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  createdAt: string;

  @ApiProperty({
    description: 'Product update date',
    example: 10,
    default: 0,
  })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  updatedAt: string;

  @ApiProperty({
    description: 'ID of the user who created the product',
    example: '87151d0b-0624-44c4-bf68-0ce921fc8ff0',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: `Image/Images of the product`,
    example: [''],
    default: [],
  })
  @IsUUID()
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  productImg: string[];
}
