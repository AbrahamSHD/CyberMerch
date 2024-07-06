import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { User } from '../common/entities/user.entity';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(user: User, createProductDto: CreateProductDto) {
    try {
      const { id } = user;
      const { productImg = [], title, ...dataProduct } = createProductDto;

      const existProduct = await this.findOneByTerm(title);

      if (existProduct)
        throw new BadRequestException(`Product with title: ${title} not found`);

      const product = await this.product.create({
        data: {
          title,
          ...dataProduct,
          userId: id,
          productImg: {
            create: productImg.map((image) => ({ url: image })),
          },
        },
        include: {
          productImg: true,
        },
      });
      return {
        ...product,
        images: product.productImg.map((image) => image.url),
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll() {
    try {
      return this.product.findMany();
    } catch (error) {
      this.logger.error(error);
    }
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

  async update(id: string, user: User, updateProductDto: UpdateProductDto) {
    return {
      id,
      user: user.id,
      updateProductDto,
    };
  }

  async remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
