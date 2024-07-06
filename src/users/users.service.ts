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
import { BcryptAdapter } from '../common/config/bcrypt.adapter';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UsersService');
  private readonly bcrypt: BcryptAdapter;
  private readonly format: generateFriendlyUrl;
  constructor(private readonly jwtService: JwtService) {
    super();
    this.format = new generateFriendlyUrl();
    this.bcrypt = new BcryptAdapter();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }

  private getJwtToken(payload: JwtPayload) {
    try {
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      this.logger.error('Error generating JWT: ', error);
      throw new BadRequestException('Could not generate JWT');
    }
  }

  async create(userDto: UserDto) {
    const { name, email } = userDto;
    let { tagName, password } = userDto;

    password = this.bcrypt.hash(password);

    const userExist = await this.user.findFirst({
      where: { email },
    });
    try {
      if (userExist)
        throw new BadRequestException(
          `User with email: ${email} already exist`,
        );

      if (!tagName || tagName.trim() === '') {
        tagName = this.format.formatText(name);
      } else {
        tagName = this.format.formatText(tagName);
      }

      //TODO: Intentar utilizar UPSET
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

      const token = this.getJwtToken({ id: userWithoutPassword.id });

      return {
        ...userWithoutPassword,
        token,
      };
    } catch (error) {
      console.log(error.detail);
      this.logger.error(error);
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

      const deleteUser = await this.user.delete({
        where: { id },
      });

      return `User with id: ${deleteUser.id} was deleted`;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('User not Found');
    }
  }
}
