import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signUp(@Body() createAuthDto: CreateUserDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('login')
  signIn(@Body() credentials: LoginUserDto) {
    return this.authService.signIn(credentials.email, credentials.password);
  }
}
