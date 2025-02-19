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
    const userIdFromParams = request.params.id;

    console.log('RolesGuard - Request User:', user);
    console.log('RolesGuard - Params ID:', userIdFromParams);
    console.log('RolesGuard - Required Role:', requiredRole);
    console.log('RolesGuard - OwnerOrRole:', ownerOrRole);

    if (!user) {
      throw new ForbiddenException('No tienes acceso a este recurso.');
    }

    if (requiredRole) {
      if (user.role !== requiredRole) {
        throw new ForbiddenException('Acceso restringido.');
      }
      return true;
    }

    if (ownerOrRole) {
      if (user.role === Role.Admin) {
        return true;
      }
      if (userIdFromParams && user.userId === userIdFromParams) {
        return true;
      }
      throw new ForbiddenException(
        'No tienes permiso para realizar esta acción.',
      );
    }

    throw new ForbiddenException('Acceso no autorizado.');
  }
}
