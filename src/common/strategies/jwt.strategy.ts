import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { PrismaClient, Roles } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { mapPrismaRolesToValidRoles } from '../utils/map-valid-roles.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaClient,
    configService: ConfigService,
  ) {
    super({
      jetFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        tagName: true,
        email: true,
        password: false,
        emailValidated: true,
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.emailValidated) {
      throw new UnauthorizedException(
        'User email not validated, please validate your email',
      );
    }

    const mappedRoles = mapPrismaRolesToValidRoles(user.roles as Roles[]);

    return {
      ...user,
      roles: mappedRoles,
    };
  }
}
