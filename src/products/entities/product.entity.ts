import { ApiProperty } from '@nestjs/swagger';
import {
  ClothingGender,
  ClothingSize,
  ProductTag,
} from '../../common/interfaces';

export class Product {
  @ApiProperty({
    example: '1e10e09d-eb51-409b-9770-21f6a8a84799',
    description: 'Product ID (UUID)',
    uniqueItems: true,
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Runner Max Shoes',
    nullable: false,
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'General information about the product',
    example:
      'Ergonomic Design: These shoes are designed to adapt to the natural shape of the foot, offering a comfortable and secure fit.',
    nullable: true,
    minLength: 1,
  })
  description: string;

  @ApiProperty({
    description: 'Product cost',
    example: '89.90',
    nullable: false,
  })
  price: string;

  @ApiProperty({
    description:
      'The "slug" is a URL-friendly version of the product name, this property is optional and if it is null it is created by the Backend',
    example: 'runner_max_shoes',
    nullable: true,
    minLength: 1,
  })
  slug?: string;

  @ApiProperty({
    description: 'Number of products in stock',
    example: 10,
    nullable: false,
    default: 0,
  })
  stock: number;

  @ApiProperty({
    description:
      'If the product is clothing, its measurements can be given according to the "ClothingSize"',
    examples: ['M', 'L', 'XL'],
    default: [],
  })
  size?: ClothingSize[];

  @ApiProperty({
    description:
      'If the product is clothing, the gender to whom it is directed can be determined according to the "ClothingGender"',
    examples: ['MALE', 'FEMALE', 'UNISEX'],
    default: [],
  })
  gender?: ClothingGender[];

  @ApiProperty({
    description:
      'Tags allow products to be classified into specific categories or relevant topics',
    example: ['Juegos', 'Música'],
    default: [],
  })
  tags?: ProductTag[];

  @ApiProperty({
    description: 'Number of products in stock',
    example: 10,
    nullable: false,
    default: 0,
  })
  createdAt?: string;

  @ApiProperty({
    description: 'Number of products in stock',
    example: 10,
    nullable: false,
    default: 0,
  })
  updatedAt?: string;

  @ApiProperty({
    description: 'ID of the user who created the product',
    example: '87151d0b-0624-44c4-bf68-0ce921fc8ff0',
    nullable: false,
  })
  userId: string;

  @ApiProperty({
    description: `URL's of the Image/Images of the product`,
    example: ['http://productImage.png'],
    default: [],
  })
  productImg?: string[];
}
