// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Discounts } from 'src/entities/discounts.entity';
// import { CreateDiscountDto } from 'src/discounts/dto/create-discount.dto';
// import { UpdateDiscountDto } from 'src/discounts/dto/update-discount.dto';

// @Injectable()
// export class DiscountsService {
//   constructor(
//     @InjectRepository(Discounts)
//     private discountsRepository: Repository<Discounts>,
//   ) {}

//   // Crear descuento
//   async create(createDiscountDto: CreateDiscountDto): Promise<Discounts> {
//     const discount = this.discountsRepository.create(createDiscountDto);
//     return await this.discountsRepository.save(discount);
//   }

//   // Obtener todos los descuentos
//   async findAll(): Promise<Discounts[]> {
//     return await this.discountsRepository.find();
//   }

//   // Obtener descuento por ID
//   async findOne(id: string): Promise<Discounts> {
//     const discount = await this.discountsRepository.findOne({
//       where: { id },
//     });
//     if (!discount) {
//       throw new NotFoundException(`Discount with ID ${id} not found`);
//     }
//     return discount;
//   }

//   async getByUserId(userId: string): Promise<Discounts[]> | null {
//     const response = await this.discountsRepository
//       .createQueryBuilder('discount')
//       .leftJoinAndSelect('discount.user', 'user')
//       .where('user.id = :userId', { userId })
//       .getMany();

//     return response;
//   }

//   // Actualizar descuento
//   async update(
//     id: string,
//     updateDiscountDto: UpdateDiscountDto,
//   ): Promise<Discounts> {
//     const discount = await this.findOne(id); // Verifica que el descuento exista
//     Object.assign(discount, updateDiscountDto); // Actualiza el objeto con los nuevos valores
//     return await this.discountsRepository.save(discount);
//   }

//   // Eliminar descuento
//   async remove(id: string): Promise<void> {
//     const discount = await this.findOne(id); // Verifica que el descuento exista
//     await this.discountsRepository.remove(discount); // Elimina el descuento
//   }
// }




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
    const existingDiscount = await this.discountsRepository.findOne({
      where: { code: createDiscountDto.code },
    });
  
    if (existingDiscount) {
      throw new Error('El código ya está en uso');
    }
  
    const discount = this.discountsRepository.create({
      ...createDiscountDto,
      currentUses: 0,
    });
  
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
  }

  async findByCode(code: string): Promise<Discounts> {
    const discount = await this.discountsRepository.findOne({ where: { code } });
  
    if (!discount) {
      throw new NotFoundException(`Código ${code} no encontrado`);
    }
  
    return discount;
  }
  

  async applyDiscount(code: string): Promise<string> {
    const discount = await this.findByCode(code);
  
    if (discount.status !== 'active') {
      throw new Error('El código ya no está activo');
    }
  
    if (discount.currentUses >= discount.maxUses) {
      throw new Error('El código ya alcanzó su límite de usos');
    }
  
    discount.currentUses++;
  
    if (discount.currentUses >= discount.maxUses) {
      discount.status = 'expired';
    }
  
    await this.discountsRepository.save(discount);
    return `Código ${code} aplicado con éxito. Usos restantes: ${discount.maxUses - discount.currentUses}`;
  }
  
}





