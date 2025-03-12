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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthGuard } from './guards/auth.guard';

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
  signUp(@Body() createAuthDto: CreateUserDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiBody({
    description: 'User data to be created',
    examples: {
      'user.signup': {
        value: {
          email: 'john@example.com',
          password: '123456789',
        },
      },
    },
  })
  signIn(@Body() credentials: LoginUserDto) {
    return this.authService.signIn(credentials.email, credentials.password);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.signInWithGoogle(req.user);
    res.redirect(
      `${process.env.CLIENT_URL}/home//?token=${response.access_token}`,
    );
  }

  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({
    description: 'Email',
    examples: {
      'user.request-password-reset': {
        value: {
          email: 'john@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent to your email',
    example: {
      message: 'Password reset link sent to your email',
    },
  })
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    description: 'Token and new password',
    examples: {
      'user.reset-password': {
        value: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODE4ODI0MDQsImV4cCI6MTY4MTg5MjQwNCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoL2xvY2FsIiwibmJmIjoxNjgxODkzNDQ0LCJpZGVudGl0eSI6InRlc3Q.l-h8-8l7-l8l9-l8l7-l8l9-l8l7',
          newPassword: 'SecurePassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    example: {
      message: 'Password successfully reset',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
    example: {
      message: 'Invalid or expired token',
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
