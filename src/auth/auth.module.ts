import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import googleOauthConfg from 'src/config/google-oauth.config';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(googleOauthConfg),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, NodeMailerService],
})
export class AuthModule {}
