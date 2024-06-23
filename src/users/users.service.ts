import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserDto } from '../common/dtos/user.dto';
import { UpdateUserDto } from '../common/dtos/update-user.dto';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UsersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }

  async create(userDto: UserDto) {
    const { name, tagName, email, password } = userDto;
    const userExist = await this.user.findFirst({
      where: { email },
    });
    try {
      if (userExist)
        throw new BadRequestException(
          `User with email: ${email} already exist`,
        );

      const createUser = await this.user.create({
        data: {
          name,
          tagName,
          email,
          password,
        },
      });

      return createUser;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(`User with email: ${email} already exist`);
    }
  }

  async findAll() {
    try {
      return await this.user.findMany();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(`Check Logs`);
    }
  }

  async findOneByTerm(term: string) {
    const user = await this.user.findFirst({
      where: {
        OR: [{ id: term }, { tagName: term }, { email: term }],
      },
    });
    try {
      if (!user)
        throw new NotFoundException(`User with id/email: '${term}' not found`);

      return user;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(`User with id/email: '${term}' not found`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.findOneByTerm(id);

      if (!existingUser) throw new BadRequestException('User not Found');

      const userUpdated = await this.user.update({
        where: { id },
        data: updateUserDto,
      });
      return userUpdated;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('User not Found');
    }
  }

  async remove(id: string) {
    try {
      const existingUser = await this.findOneByTerm(id);

      if (!existingUser) throw new BadRequestException('User not Found');

      const deleteUser = this.user.delete({
        where: { id },
      });

      return deleteUser;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('User not Found');
    }
  }
}
