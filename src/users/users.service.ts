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
import { generateFriendlyUrl } from '../common/utils/format-text.utils';
import { BcryptAdapter } from 'src/common/config/bcrypt.adapter';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UsersService');
  private readonly bcrypt: BcryptAdapter;
  private readonly format: generateFriendlyUrl;
  private readonly jwtService: JwtService;
  constructor() {
    super();
    this.format = new generateFriendlyUrl();
    this.bcrypt = new BcryptAdapter();
    this.jwtService = new JwtService();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }

  async create(userDto: UserDto) {
    const { name, email } = userDto;
    let { tagName, password } = userDto;

    password = await this.bcrypt.hash(password);
    const userExist = await this.user.findFirst({
      where: { email },
    });

    try {
      //TODO: Intentar utilizar UPSET
      if (userExist)
        throw new BadRequestException(
          `User with email: ${email} already exist`,
        );

      if (!tagName || tagName.trim() === '') {
        tagName = this.format.formatText(name);
      } else {
        tagName = this.format.formatText(tagName);
      }

      const createUser = await this.user.create({
        data: {
          name,
          tagName,
          email,
          password,
        },
      });

      const userWithoutPassword = { ...createUser };
      delete userWithoutPassword.password;

      // TODO: Regresar Token

      return { ...userWithoutPassword };
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
      this.logger.error(error);
      throw new NotFoundException(`User with id/email: '${term}' not found`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let tag, passwordEncrypt;
    try {
      const existingUser = await this.findOneByTerm(id);
      const { tagName, password, ...data } = updateUserDto;

      if (tagName) {
        tag = this.format.formatText(tagName);
      }

      if (password) {
        passwordEncrypt = this.bcrypt.hash(password);
      }

      if (!existingUser) throw new BadRequestException('User not Found');

      const userUpdated = await this.user.update({
        where: { id },
        data: {
          tagName: tag,
          password: passwordEncrypt,
          ...data,
        },
      });

      const userUpdatedWithoutPassword = { ...userUpdated };

      delete userUpdatedWithoutPassword.password;

      return userUpdatedWithoutPassword;
    } catch (error) {
      this.logger.error(error);
      console.log(error.detail);
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
