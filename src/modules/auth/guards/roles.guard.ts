import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@app/common/decorators';
import { Role } from '@app/generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles || requiredRoles.length == 0) return true;

    const { user } = ctx.switchToHttp().getRequest();

    if (!user?.role) {
      throw new ForbiddenException('ROLE_NOT_FOUND');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('INSUFFICIENT_ROLE');
    }

    return true;
  }
}
