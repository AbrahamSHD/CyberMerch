import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../interfaces';

export class User {
  @ApiProperty({
    example: '1e10e09d-eb51-409b-9770-21f6a8a84799',
    description: 'User ID (UUID)',
    uniqueItems: true,
  })
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'Juan Perez',
    nullable: false,
    minLength: 1,
  })
  name: string;

  @ApiProperty({
    example: 'juan_pe',
    description: 'User tag identifier',
    nullable: false,
  })
  tagName: string;

  @ApiProperty({
    description: 'User email',
    example: 'juan1@gmail.com',
    nullable: false,
  })
  email: string;

  @ApiProperty({
    description: 'Validated email - Default(false)',
    example: false,
    default: false,
  })
  emailValidated?: boolean;

  @ApiProperty({
    description: 'This value is assigned by default as "user" by PrismaORM',
    example: ['ADMIN'],
    default: ['USER'],
  })
  roles: Roles[];

  @ApiProperty({
    description: 'User-created products',
    example: ['Runner Max Shoes'],
    default: [],
  })
  products?: string[];

  @ApiProperty({
    description: 'User-created products',
    example: 'http://userImage.png',
  })
  useImg?: string;
}
