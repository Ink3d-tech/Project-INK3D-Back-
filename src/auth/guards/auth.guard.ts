// import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   private readonly logger = new Logger(AuthGuard.name);

//   constructor(private jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const authHeader = request.headers.authorization;

//     this.logger.debug(`🛂 Analizando autorización: ${authHeader}`);

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       this.logger.warn('❌ Falta el token o formato incorrecto');
//       return false;
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//       const payload = this.jwtService.verify(token);
//       this.logger.debug(`✅ Token válido: ${JSON.stringify(payload)}`);
//       request.user = payload; // 🔹 Aquí se asigna `req.user`
//       return true;
//     } catch (error) {
//       this.logger.error(`❌ Error al verificar el token: ${error.message}`);
//       return false;
//     }
//   }
// }



import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Falta el token o formato incorrecto');
      return false;
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; 
      return true;
    } catch (error) {
      this.logger.error(`Error al verificar el token: ${error.message}`);
      return false;
    }
  }
}
