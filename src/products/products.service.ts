import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createProductDto: CreateProductDto) {
    // const product = await this.product.create({
    //   data: {
    //     title: createProductDto.title,
    //     description: createProductDto.description,
    //     price: createProductDto.price,
    //     slug: createProductDto.slug,
    //     stock: createProductDto.stock,
    //     size: createProductDto.size,
    //     gender: createProductDto.gender,
    //     tags: createProductDto.tags,
    //     userId: createProductDto.userId,
    //     productImg: createProductDto.productImg,
    //   },
    // });
    // return product;
  }

  async findAll() {
    return this.product.findMany();
  }

  async findOneByTerm(term: string) {
    const product = this.product.findFirst({
      where: {
        OR: [{ id: term }, { title: term }, { slug: term }],
      },
    });

    try {
      if (!product)
        throw new NotFoundException(
          `Product with id/name/slug: '${term}' not found`,
        );
      return product;
    } catch (error) {
      this.logger.error(error);
      // throw new NotFoundException(
      //   `Product with id/name/slug: '${term}' not found`,
      // );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
