import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Juan Perez',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'juan_pe',
    description: 'User tag identifier',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  tagName: string;

  @ApiProperty({
    description: 'User email',
    example: 'juan1@gmail.com',
    nullable: false,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User Password - It is encrypted when saved',
    nullable: false,
    minLength: 12,
    maxLength: 50,
  })
  @IsString()
  @MinLength(12, {
    message: 'Password must be twelve characters or more',
  })
  @MaxLength(50, {
    message: 'Password must be fifty or fewer characters',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @IsNotEmpty()
  password: string;
}
