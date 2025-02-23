<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountsService {
  create(createDiscountDto: CreateDiscountDto) {
    return 'This action adds a new discount';
  }

  findAll() {
    return `This action returns all discounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  remove(id: number) {
    return `This action removes a #${id} discount`;
=======
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discounts } from 'src/entities/discounts.entity';
import { CreateDiscountDto } from 'src/discounts/dto/create-discount.dto';
import { UpdateDiscountDto } from 'src/discounts/dto/update-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discounts)
    private discountsRepository: Repository<Discounts>,
  ) {}

  // Crear descuento
  async create(createDiscountDto: CreateDiscountDto): Promise<Discounts> {
    const discount = this.discountsRepository.create(createDiscountDto);
    return await this.discountsRepository.save(discount);
  }

  // Obtener todos los descuentos
  async findAll(): Promise<Discounts[]> {
    return await this.discountsRepository.find();
  }

  // Obtener descuento por ID
  async findOne(id: string): Promise<Discounts> {
    const discount = await this.discountsRepository.findOne({
      where: { id },
    });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async getByUserId(userId: string): Promise<Discounts[]> | null {
    const response = await this.discountsRepository
      .createQueryBuilder('discount')
      .leftJoinAndSelect('discount.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return response;
  }

  // Actualizar descuento
  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discounts> {
    const discount = await this.findOne(id); // Verifica que el descuento exista
    Object.assign(discount, updateDiscountDto); // Actualiza el objeto con los nuevos valores
    return await this.discountsRepository.save(discount);
  }

  // Eliminar descuento
  async remove(id: string): Promise<void> {
    const discount = await this.findOne(id); // Verifica que el descuento exista
    await this.discountsRepository.remove(discount); // Elimina el descuento
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  }
}
