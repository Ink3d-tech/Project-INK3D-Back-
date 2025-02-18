import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const secret = process.env.JWT_SECRET;

    try {
      const user = this.jwtService.verify(token, { secret });

      // Convertir exp y iat a fechas para validación
      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      // Asignar roles basado en enum role
      if (user.role === 'admin') {
        user.role = ['admin'];
      } else if (user.role === 'mod') {
        user.role = ['mod'];
      } else {
        user.role = ['user'];
      }

      if (user.exp < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      // Error genérico para otros casos
      throw new UnauthorizedException('Unexpected error: ' + error.message);
    }
  }
}
