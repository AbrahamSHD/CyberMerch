import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../common/interfaces';
import { User } from '../common/entities/user.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    links: {
      self: {
        operationId: 'createProduct',
        parameters: {
          name: '$response.body#/',
          description: '$response.body#/',
          price: '$response.body#/',
        },
      },
    },
    type: Product,
  })
  @Auth(ValidRoles.ADMIN)
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(user, createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':term')
  findOneByTerm(@Param('term') term: string) {
    return this.productsService.findOneByTerm(term);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, user, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
