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
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private nodemailerService: NodeMailerService,
  ) {}

  async signUp(user: Partial<User>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword, confirmPassword: undefined};

    if (!newUser) {
      throw new NotFoundException('User not found');
    }

    const savedUser = await this.userRepository.save(newUser);

    // Enviar email de bienvenida
    await this.nodemailerService.sendEmail(
      savedUser.email,
      '¡Bienvenido a Ink3d Store, esperamos que disfrutes de nuestra Tienda & Magazine!',
      `Hola ${savedUser.name}, tu cuenta ha sido creada exitosamente.`,
    );

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

  async validateGoogleUser(googleUser: Partial<User>) {
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

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        name,
        password: 'isGoogleUser!',
        role: 'user',
      });
      await this.userRepository.save(user);

      await this.nodemailerService.sendEmail(
        user.email,
        '¡Bienvenido a Ink3d Store, esperamos que disfrutes de nuestra Tienda & Magazine!',
        `Hola ${user.name}, tu cuenta ha sido creada exitosamente.`,
      );
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
