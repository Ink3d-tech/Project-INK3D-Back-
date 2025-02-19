import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new NotFoundException('Invalid credentials');
    }
    const payload = { userId: user.id, email: user.email };

    const token = this.jwtService.sign(payload);
    return { token, message: 'User logged in successfully' };
  }
}
