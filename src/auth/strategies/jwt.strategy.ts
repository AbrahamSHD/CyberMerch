import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { User } from '../../common/entities/user.entity';
import { PrismaClient, Roles } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { mapPrismaRolesToValidRoles } from '../../common/utils/map-valid-roles.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaClient,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.prisma.user.findFirst({
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
