import { Roles } from '@prisma/client';
import { ValidRoles } from '../interfaces';

export function mapPrismaRolesToValidRoles(prismaRoles: Roles[]): ValidRoles[] {
  return prismaRoles.map((role) => {
    switch (role) {
      case Roles.USER:
        return ValidRoles.USER;
      case Roles.ADMIN:
        return ValidRoles.ADMIN;
      case Roles.SUPERUSER:
        return ValidRoles.SUPERUSER;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  });
}
