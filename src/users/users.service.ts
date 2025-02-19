/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';

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

  async updateUser() {}

  async deActivate() {}
}
