import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ALLOW_OWNER_OR_ROLE } from '../../decorators/allow-owner-or-role.decorator';
import { ALLOW_ONLY_ROLE } from '../../decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role>(
      ALLOW_ONLY_ROLE,
      context.getHandler(),
    );
    const ownerOrRole = this.reflector.get<Role>(
      ALLOW_OWNER_OR_ROLE,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // const userIdFromParams = request.params.id;
    // console.log('USER FROM PARAMS', userIdFromParams);

    if (!user) {
      throw new ForbiddenException(
        'You do not have permission to access this resource!',
      );
    }

    const userIdFromBody = request.body?.userId;
    if (userIdFromBody && user.id !== userIdFromBody) {
      throw new ForbiddenException('Access denied: userId mismatch.');
    }

    if (requiredRole) {
      if (!user.role.includes(requiredRole)) {
        throw new ForbiddenException('Access denied.');
      }
      return true;
    }

    if (ownerOrRole) {
      if (!user.role.includes(ownerOrRole)) {
        throw new ForbiddenException(
          'You are not authorized to access this resource!',
        );
      }
      return true;
    }

    throw new ForbiddenException('Unaurhorized.');
  }
}
