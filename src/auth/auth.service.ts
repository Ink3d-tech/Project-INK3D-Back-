
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService, // Agregamos ConfigService
  ) {}

  async signUp(user: Partial<User>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // Usa la clave secreta
      expiresIn: '1d',
    });

    return { token, message: 'User logged in successfully' };
  }

  async signInWithGoogle(profile: any): Promise<{ access_token: string }> {
    const { email, name } = profile;

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        name,
        role: 'user',
      });

      user = await this.userRepository.save(user);
    }

    const payload = { userId: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // Se asegura de usar la clave secreta
      expiresIn: '1d',
    });

    return { access_token };
  }
}
