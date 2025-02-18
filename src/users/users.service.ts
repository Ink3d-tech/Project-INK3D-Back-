/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { log } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(page: number, limit: number, search?: string) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('user.favorites', 'favorites');

    if (search && search.trim() !== '') {
      queryBuilder.where(
        `(user.name ILIKE :search OR user.email ILIKE :search OR user.address ILIKE :search OR user.city ILIKE :search OR user.country ILIKE :search OR user.bio ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    queryBuilder.skip(page * limit).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    const allUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return { allUsers, total };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'favorites'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      name: updateUserDto.name,
      email: updateUserDto.email,
      phone: updateUserDto.phone,
      address: updateUserDto.address,
      city: updateUserDto.city,
      country: updateUserDto.country,
      bio: updateUserDto.bio,
    });

    return updatedUser;
  }

  async activate(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isActive: false,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      isActive: true,
    });

    return updatedUser;
  }

  async deActivate(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      isActive: false,
    });

    return updatedUser;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedOldPassword = await bcrypt.hash(
      changePasswordDto.oldPassword,
      10,
    );
    console.log(hashedOldPassword);

    const compareOldPassword = await bcrypt.compare(
      hashedOldPassword,
      user.password,
    );
    if (!compareOldPassword) {
      throw new NotFoundException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    const comparedHashedPassword = await bcrypt.compare(
      hashedNewPassword,
      hashedOldPassword,
    );
    console.log('COMPARED HASHED PASSWORD:', comparedHashedPassword);

    if (comparedHashedPassword) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      password: hashedNewPassword,
    });
    console.log(updatedUser);

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = await this.userRepository.delete({ id });

    return deletedUser;
  }
}
