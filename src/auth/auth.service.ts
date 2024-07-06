import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { BcryptAdapter } from '../common/config/bcrypt.adapter';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { User } from '../common/entities/user.entity';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');
  private readonly bcrypt: BcryptAdapter;

  constructor(private readonly jwtService: JwtService) {
    super();
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

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      const user = await this.user.findFirst({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('User/Password not valid');
      }

      const isPasswordValid = this.bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('User/Password not valid');
      }

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      return {
        user: userWithoutPassword,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('User/Password not valid');
    }
  }

  async logout(user: User) {
    return {
      user,
    };
  }
}
