import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import googleOauthConfig from 'src/config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(googleOauthConfig),
    PassportModule.register({ defaultStrategy: 'JWT_SECRET' }), // Habilitar Passport con JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' }, // Tiempo de expiración del token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy], // Agregamos JwtStrategy
  exports: [AuthService], // Exportamos AuthService para usarlo en otros módulos
})
export class AuthModule {}
