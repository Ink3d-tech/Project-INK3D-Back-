import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiBody({
    description: 'User data to be created',
    examples: {
      'user.signup': {
        value: {
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456789',
          confirmPassword: '123456789',
          phone: 123456789,
          address: '123 Main St',
          city: 'Anytown',
          country: 'USA',
          bio: 'Lorem ipsum dolor sit amet',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    example: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: 123456789,
      address: '123 Main St',
      city: 'Anytown',
      country: 'USA',
      bio: 'Lorem ipsum dolor sit amet',
    },
  })
  async signUp(@Body() createAuthDto: CreateUserDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiBody({
    description: 'User credentials for login',
    examples: {
      'user.signin': { // <- Cambio aquí
        value: {
          email: 'john@example.com',
          password: '123456789',
        },
      },
    },
  })
  async signIn(@Body() credentials: LoginUserDto) {
    return this.authService.signIn(credentials.email, credentials.password);
  }

@UseGuards(GoogleAuthGuard)
@Get('google')
async googleLogin() {
  return { message: 'Redirecting to Google login...' };
}

  
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req) {
    try {
      const response = await this.authService.signInWithGoogle(req.user);
      return response; // Devuelve el token directamente en la respuesta
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Error en la autenticación con Google');
    }
  }
}
