import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(user: Partial<User>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassord = await bcrypt.hash(user.password, 10);

    const newUser = { ...user, password: hashedPassord };
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
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

    const token = this.jwtService.sign(payload, { expiresIn: '1d' });

    return { token, message: 'User logged in successfully' };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });
    if (user) {
      return user;
    }
    return await this.signUp(googleUser);
  }

  async signInWithGoogle(profile: any): Promise<{ access_token: string }> {
    const { email, name } = profile;

    // Buscar usuario por email
    let user = await this.userRepository.findOne({ where: { email } });

    // Si no existe, lo creamos con un flag isGoogleUser (sin contraseña)
    if (!user) {
      user = this.userRepository.create({
        email,
        name,
        password: 'isGoogleUser!',
        role: 'user',
      });
      await this.userRepository.save(user);
    }

    // Generar el token JWT
    const payload = { userId: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
