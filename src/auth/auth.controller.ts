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
}
